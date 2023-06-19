if @message
  json.message @message
  json.redirect_to '/subscription'
end