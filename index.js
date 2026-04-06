// Data Improted into the Javascript //
import { tweetsData as initialTweets } from './data.js'
let tweetsData = initialTweets

// Function uuid //
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
// localStorage.clear()

// LOAD FROM LOCAL STORAGE (IMPORTANT: must come early)
const storedTweets = JSON.parse(localStorage.getItem('tweetsData'))
if (storedTweets) {
   tweetsData = storedTweets
}

// DOM ELEMENTS
const tweetInput = document.getElementById('tweet-input')
const feed = document.getElementById('feed')


// FUNCTIONS
// Function handleLikeClick()
function handleLikeClick(tweetId) {
   const tweetTargetObj = tweetsData.filter(function(tweet){
      return tweet.uuid === tweetId
   })[0]
   if (!tweetTargetObj.isLiked){
      tweetTargetObj.likes++
   } else { 
      tweetTargetObj.likes-- 
   }

   tweetTargetObj.isLiked = !tweetTargetObj.isLiked

   localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
   render()
}


// Function handleRetweetClick() filtering tweetTargetObj for Retweets //
function handleRetweetClick(tweetId) {
   const tweetTargetObj = tweetsData.filter(function(tweet){
      return tweet.uuid === tweetId
   })[0]
   if (!tweetTargetObj.isRetweeted){
      tweetTargetObj.retweets++
   } else { 
      tweetTargetObj.retweets-- 
   }

   tweetTargetObj.isRetweeted = !tweetTargetObj.isRetweeted

   localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
   render()
}


// Function handleReplyClick() for comments and replies //
function handleReplyClick(tweetId) {
   document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
}

function handleNewTweet(){
   if(tweetInput.value){
         let newTweet = {
            handle: `@fakharalam`,
            profilePic: `/images/profile.png`,
            likes: 0, 
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
         }
         tweetsData.unshift(newTweet)
      }
      localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
      render()
      tweetInput.value = ''
}

function handleReplySubmit(tweetId) {
   const tweetTargetObj = tweetsData.filter(function(tweet){
      return tweet.uuid === tweetId
   })[0]
   const replyInput = document.getElementById(`reply-input-${tweetId}`)
   if (replyInput.value){
      let newReply = {
            handle: `@fakharalam`,
            profilePic: `/images/profile.png`,
            tweetText: document.getElementById(`reply-input-${tweetId}`).value,
         }
      tweetTargetObj.replies.unshift(newReply)
   }
   localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
      render()
      replyInput.value = ''
   
}

// EVENT LISTENER
document.addEventListener('click', function(e){

   if (e.target.dataset.like){
      handleLikeClick(e.target.dataset.like)
   }

   if (e.target.dataset.retweet){
      handleRetweetClick(e.target.dataset.retweet)
   }

   if (e.target.dataset.reply){
      handleReplyClick(e.target.dataset.reply)
   }

   if (e.target.id === 'tweet-btn'){
      handleNewTweet()
   }

   if (e.target.dataset.replyBtn){
      handleReplySubmit(e.target.dataset.replyBtn)
   }
})


// Only 1 FeedHTML //
function getFeedHTML() {
   let feedHTML = ''
   tweetsData.forEach(function(tweets){
      let likeIconClass = ''
      let retweetIconClass = ''
      if (tweets.isLiked){
         likeIconClass = 'liked'
      }
      if (tweets.isRetweeted){
         retweetIconClass = 'shared'
      }

// Conguring repliesHtml prior to the final feedHtml // 
      let repliesHtml = ''
      if (tweets.replies.length > 0){
         console.log(tweets.uuid)
      tweets.replies.forEach(function(reply){
         repliesHtml +=
            `<div class="tweet-reply">
               <div class="tweet-inner">
                  <img src="${reply.profilePic}" class="profile-pic">
                  <div>
                     <p class="handle">${reply.handle}</p>
                     <p class="tweet-text">${reply.tweetText}</p>
                  </div>
               </div>
            </div>`
         })
      } 
      
      feedHTML += 
         `<div class="tweet">
            <div class="tweet-inner">
               <img src=${tweets.profilePic} class="profile-pic">
               <div>
                     <p class="handle">${tweets.handle}</p>
                     <p class="tweet-text">${tweets.tweetText}</p>
                     <div class="tweet-details">
                        <i class="fa-regular fa-comment-dots" data-reply="${tweets.uuid}"></i>
                        <span class="tweet-detail">
                           ${tweets.replies.length}
                        </span>
                        <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweets.uuid}"></i>
                        <span class="tweet-detail">
                           ${tweets.likes}
                        </span>
                        <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweets.uuid}"></i>
                        <span class="tweet-detail">
                           ${tweets.retweets}
                        </span>
                     </div>   
               </div>            
            </div>
             <div class="hidden" id="replies-${tweets.uuid}">
               <div class="reply-input-area">
                  <input type="text" id="reply-input-${tweets.uuid}" placeholder="write your reply...." required>
                  <button class="submit-btn" data-reply-btn="${tweets.uuid}" type="submit">Reply</button>
               </div>
               ${repliesHtml}
            </div>
            
         </div>`
      })
   return feedHTML
}

// Function render() //
function render(){
   feed.innerHTML = getFeedHTML()

}

// Calling function render () //
render()

