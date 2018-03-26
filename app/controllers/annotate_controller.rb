class AnnotateController < ApplicationController
  before_filter :init_view_options

  def init_view_options
    @site_section = :annotate
    @solr = Catalog.factory_create(session[:use_test_index] == "true")
    return true
  end

  def index
    @annotation = Annotation.new
    @predicates = Predicate.where('id NOT IN (?)' , [1,2]).order(:display_name)

  end

  def create
    user_id = get_curr_user_id()
    # flag
    # 1 => active,
    # 2 /;=> review done by admin (if bibliographer is making any annotations or match then it should be approved directly)
    flag = (is_bibliographer? or is_admin?) ? "2" : "1"

    puts "========================================================================"
    puts params
    params[:annotationoption]

    subject_uri = session[:annotateUri]
    object_uri = params[:annotation][:object_uri]

    matchinfo = Annotation.where(["subject_uri = ? and object_uri = ?", subject_uri, object_uri])
    if(matchinfo.present?)
      @errorMsg = "The following annotation has already been made Please go to the Review page."
    elsif(subject_uri.eql? object_uri)
      @errorMsg = "You can not make annotation with the same subject."
    end

    if @errorMsg.nil?
      lastrecord = Attachment.find(:last)
      lastrecord = if lastrecord.present? then lastrecord.attachment_no else 0 end

      begin
        respond_to do |format|
          annotation = Annotation.new()
          annotation.subject_uri = subject_uri
          annotation.flag = flag
          annotation.user_id = user_id
          annotation.feedback = params[:annotation][:feedback] if ( is_scholar? and !is_bibliographer? or !is_admin?)
          annotation.object_uri = object_uri
          annotation.predicate_id = params[:annotation][:predicate]
          annotation.attachment_no = (lastrecord + 1) if params[:documents].present? and ( is_scholar? and !is_bibliographer? or !is_admin? )
          # if solr_update_mode is empty, that will be feedback from other users; ignore that while handling annotation update to solr
          annotation.solr_update_mode = params[:annotationoption].downcase if params[:annotationoption].present?
          annotation.save!

          if is_bibliographer? or is_admin?
            annotationid = Annotation.where(["subject_uri = ? and object_uri = ?", subject_uri, object_uri])
            review = Review.new()
            review.annotation_id = annotationid.first.id
            review.user_id = user_id
            review.feedback = params[:annotation][:feedback]
            review.attachment_no = (lastrecord + 1) if params[:documents].present?
            review.status = 1 # This is direct approval. Biblographer's annotation is direct approval.  # 1. approve, 2. disapprove
            review.save!
            # Update Solr index with the latest information
            update_solr(annotationid.first) rescue nil
          end

          if params[:documents].present?
            params[:documents].each { |document|
              time_footprint = Time.now.to_formatted_s(:number)
              uniq_name = (0...10).map { (65 + rand(26)).chr }.join

              directory = Rails.root.join('public', 'uploads')
              FileUtils.mkdir_p(directory) unless File.exists?(directory)

              File.open(Rails.root.join('public', 'uploads', document.original_filename), 'wb') do |file|
                file.write(document.read)
                uniq_filename = (lastrecord + 1).to_s + "_" + uniq_name + "_" + time_footprint + File.extname(file)
                uniq_filepath = Rails.root.join('public', 'uploads', uniq_filename)
                File.rename(file, uniq_filepath)
                attachment = Attachment.new
                attachment.attachment_no = (lastrecord + 1)
                attachment.file_name = uniq_filename
                attachment.content_type = document.content_type
                attachment.save!
              end
            }
          end

          format.html { redirect_to '/fullrecord?action=fullrecord&uri='+session[:annotateUri]+'' }
        end
      end
    end
  end

  def search
    results = Annotation.autocomplete_search(params)
    render json: results
  end


  private

  def update_solr(annotation)
    predicate = annotation.predicate
    solr_field_name = predicate.display_name
    solr_field_value = annotation.object_uri
    solr_operaton = annotation.solr_update_mode.present? ? annotation.solr_update_mode : 'append'

    solr_response = @solr.modify_object(annotation.subject_uri, solr_operaton,
                                        solr_field_name, solr_field_value) # action = append or replace

    puts "Solr Response:: #{solr_response}\n\n"
    puts annotation.attributes
  end
end
