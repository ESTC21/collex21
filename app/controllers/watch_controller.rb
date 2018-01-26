class WatchController < ApplicationController

  before_filter :validate_user

  def create
    watching_record = WatchingRecord.new(uri: params[:uri], title: params[:title], user_id: params[:user_id])
    if watching_record.save
      render json: {uri:  params[:uri], saved: true}, status: :ok
    else
      render json: {uri:  params[:uri], saved: false}, status: :ok
    end
  end

  def delete
    watching_record = WatchingRecord.where(uri: params[:uri], user_id: params[:user_id]).last
    if watching_record && watching_record.destroy
      render json: {uri:  params[:uri], destroy: true}, status: :ok
    else
      render json: {uri:  params[:uri], destroy: false}, status: :ok
    end
  end

  private

  def validate_user
    if !(current_user && current_user.id == params[:user_id].to_i)
      render nothing: true, :status => "404 Not Found"
    end
  end
end
