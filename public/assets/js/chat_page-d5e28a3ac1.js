var userlog,lastTypingTime,users,typing=!1;function addmessagesHtmltoPage(e){$(".chatMessages").append(e)}function messageRecived(e){0==$(`[data-room="${e.chat._id}"]`).length||addChatMessageHtml(e),refreshMessage()}function markallmessagesasread(){$.ajax({url:`/messages/${chat}/okay`,type:"put",success:()=>{console.log("hi"),refreshMessage()}})}function getChatName(e,s){var t=e.chatName;(users=e.users,t)||(t=getOtherChatUsers(e.users,s).map((e=>e.name)).join(", "));return t}function getOtherChatUsers(e,s){return 1==e.length?e:e.filter((e=>e._id!=s._id))}function updateTyping(){typing||(typing=!0,socket.emit("typing",chat)),lastTypingTime=(new Date).getTime();setTimeout((()=>{(new Date).getTime()-lastTypingTime>=1e3&&typing&&(socket.emit("stop typing",chat),typing=!1)}),1e3)}function messageSubmitted(){var e=$("#inputTextbox").val().trim();""!=e&&(sendMessage(e),$("#inputTextbox").val(""),socket.emit("stop typing",chat),typing=!1)}function sendMessage(e){$.post("/messages/message",{content:e,chatId:`${chat}`},((e,s)=>{userlog=e.userlog,addChatMessageHtml(e.message),socket.emit("new message",e)}))}function addChatMessageHtml(e){if(!e)return alert("message is not valid");var s=createMessageHtml(e,null,"");$(".chatMessages").append(s),scrollToBottom(!0)}function createMessageHtml(e,s,t){var a=e.sender,n=a.name,r=a._id,o=t!=r,i=(null!=s?s.sender._id:"")!=r,c="",l=e.sender._id==userlog._id,d=l?"mine":"theirs";o&&(d+=" first",l||(c=`<span class="senderName">${n}</span>`));var u="";i&&(d+=" last",u=`<img src="${a.profilePic}">`);var m="";return l||(m=`<div class="imageContainer">\n                        ${u}\n                        </div>`),`<li class="message ${d}">\n            ${m}\n            <div class="messageContainer">\n\n            ${c}\n\n            <span class="messageBody">${e.content}</span>\n\n            </div>\n\n            </li>`}function scrollToBottom(e){var s=$(".chatMessages"),t=s[0].scrollHeight;e?s.animate({scrollTop:t},"slow"):s.scrollTop(t)}let timer,userToAdd;$(document).ready((()=>{socket.emit("joinroom",chat),socket.on("typing",(()=>{$(".typingDots").show()})),socket.on("stop typing",(()=>{$(".typingDots").hide()})),$.get(`/messages/chatname/${chat}`,(e=>{$("#chatName").text(getChatName(e.chat[0],e.userlog))})),$.get(`/messages/chatname/${chat}/message`,(e=>{userlog=e.userlog;var s=[],t="";e.messages.forEach(((a,n)=>{var r=createMessageHtml(a,e.messages[n+1],t);s.push(r),t=a.sender._id})),addmessagesHtmltoPage(s.join("")),scrollToBottom(!1),markallmessagesasread()}))})),$("#chatNameButton").click((()=>{var e=$("#chatNameTextbox").val().trim();$.ajax({url:`/messages/chatname/${chat}`,type:"put",data:{chatName:e},success:(e,s,t)=>{if(200!=t.status)return alert("chutiya");location.reload()}})})),socket.on("message received",(e=>{messageRecived(e.message)})),$("#chatNameModal").on("show.bs.modal",(function(){$("#chatNameTextbox").val("")})),$(".sendMessageButton").click((()=>{messageSubmitted()})),$("#inputTextbox").keydown((e=>{if(updateTyping(),13==e.which)return messageSubmitted(),!1})),$(document).on("click",(e=>{const s=$(e.target);if(s.hasClass("leaveChat"))return null!=s.data().id&&swal({title:"Are you sure?",text:"Once Exited You Will no Longer be the Member of this Group!",icon:"warning",buttons:!0,dangerMode:!0}).then((e=>{e&&$.ajax({url:`/chats/leaveChat/${chat}`,type:"PUT",success:()=>window.location.href="/messages",error:()=>confirm("Could not update. Please try again")})})),!1}));const searchBox=$("#addNewUserModalTextBox"),addUser=$("#addNewUserModalButton");function searchUsers(e){$.ajax({url:"/api/us/sr",type:"post",data:{obj:e},success:e=>{outputSelectableUsers(e.result,$(".userList"))}})}function outputSelectableUsers(e,s){s.html(""),e.forEach((e=>{if(users.some((s=>s._id===e._id)))return;const t=createUserHtml(e),a=$(t);a.click((()=>userSelected(e))),s.append(a)}))}function createUserHtml(e){const s=e.name;return`<div class='user'>\n                <div class='userImageContainer'>\n                    <img src='${e.profilePic}'>\n                </div>\n                <div class='userDetailsContainer'>\n                    <div class='header'>\n                        <a href='#'>${s}</a>\n                        <span class='username'>@${e.name}</span>\n                    </div>\n                </div>\n            </div>`}function userSelected(e){searchBox.val(e.name).focus(),$(".userList").html(""),userToAdd=e}null!=searchBox&&searchBox.on("keydown",(function(e){clearTimeout(timer);const s=$(this);let t=s.val();""!==t||8!==e.keyCode?timer=setTimeout((()=>{t=s.val().trim(),""===t?$(".userList").html(""):searchUsers(t)}),1e3):$(".userList").html("")})),null!=addUser&&addUser.on("click",(()=>{null!=userToAdd?$.ajax({url:`/chats/${chat}/addNewMember`,data:userToAdd,type:"PUT",success:()=>location.reload(),error:()=>confirm("Could not update. Please try again")}):alert("No user selected. Please try again")})),$("#addNewUserModal").on("hidden.bs.modal",(()=>{searchBox.val(""),$(".userList").html(""),userToAdd=null}));