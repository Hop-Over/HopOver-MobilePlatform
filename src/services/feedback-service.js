import config from '../../config.json'
import ChatService from './chat-service'
import store from '../store'


class FeedbackService{
    state = {
      isSharing: false
    }

    sendFeedback = async (userId, bugId, data) => {
        const postUrl = config.feedbackConfig.feedbackUrl + userId + '/' + bugId + '/' + ".json"

        fetch(postUrl,{
            method: 'PATCH',
            body: JSON.stringify({
              report: data
            })
          })
          .catch(err => console.log(err))
          console.log("Sent feedback")
    }

}

let feedbackService = new FeedbackService()
Object.freeze(feedbackService)
export default feedbackService