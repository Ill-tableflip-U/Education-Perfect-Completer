
import { init } from 'https://github.com/Ill-tableflip-U/Education-Perfect-Completer/raw/main/get-questions.js'



let ep_questions = await init()

let previousHref = window.location.href;
setInterval(() => { 
  const currentHref = window.location.href;
  if (previousHref !== currentHref) {
    previousHref = currentHref;
    ep_questions = init()
  }
}, 100);
alert('EP completer injected!')

console.log(ep_questions)






async function ChatGPT(openai_key, prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openai_key}`
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo-1106",
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            })
        });

  const data = await response.json();
  return data.choices[0].message.content
}

function md(X){
  return X.replace(/[^0-9a-zA-Z\s]/g, '')
}

function submit_blue_section(){
  document.querySelector('.submit.action-bar-button.v-group.ng-isolate-scope button').click()
}

function next(X){
  if(X==='blue'){
    submit_blue_section()
  }else{
    document.getElementsByClassName("continue arrow action-bar-button v-group ng-isolate-scope")[X].children[0].click()

    }
  
}
let checkbuttons = ['#next-button', '.self-rating-stars.star-rating-ext div .star-5', '.stuck-button.v-group.v-align-center.ng-binding', '.positive.action-bar-button.v-group.ng-isolate-scope button', '.explanation-continue.arrow.action-bar-button.v-group.ng-isolate-scope button']
async function cycle(){
  if(!active){return}
  checkbuttons.forEach(button => {
    if(document.querySelector(button)){
      console.log(button)
      document.querySelector(button).click()
    }
  })
  let completed = document.querySelector('#modal-section-complete .activity-complete-container.ng-scope')
  if(completed){
    completed.querySelectorAll('#confidence-div div div .grey-star')[4].click()
    setTimeout(() => {
      completed.querySelectorAll('#rating-div div div .grey-star')[0].click()
      document.querySelector('.exit-button.gray-text-link-button.ng-scope').click()
    }, 800);
  }



  if (document.querySelector(".game-action-bar.sa-action-bar.facts,.game-action-bar.sa-action-bar.skills,.game-action-bar.sa-action-bar.exercise")) {
    let nextcode
    if(document.querySelector("game-action-bar.sa-action-bar.facts")){
      nextcode = 2
    }else if(document.querySelector('.game-action-bar.sa-action-bar.exercise')){
      nextcode = "blue"

    }else{
      nextcode = 3
    }
    //if the current question is purple-themed multiple choice
    let ep_activityContainer = document.querySelector('#question-container-group')
    let ep_question
    
    ep_activityContainer.classList.forEach(className => { 
      // getting the current question ID and finding that question within the list retrieved from EP servers
        if (className.startsWith('contentid-')) {
            ep_questionId = parseInt(className.substring('contentid-'.length))
            ep_question = ep_questions.result.Questions.find(obj => obj.ID === ep_questionId);
        }
    }); 
    let prevent_submission = false
    let dropdown_index = 0
      let textbox_index = 0
      console.log(ep_question);console.log(ep_question);console.log(ep_question);
      
    ep_question.Definition.Components.forEach((field, index) => { // determining the fields and answers of the purple multiple choice question.
      
        
      
      
      if(field.ComponentTypeCode==='MULTICHOICE_COMPONENT'){
        //if the field is multiple choice (single select)
        let correct_answers = field.Options.filter(option => option.Correct === 'true');
        const answerbuttons = document.querySelectorAll("#question-container-group .h-group.h-align-center .mcq-preview-option, #question-container-group .v-group.h-align-center .mcq-preview-option");

        const possible_answers = [];
        
        answerbuttons.forEach(answerbutton => {
            const answer = answerbutton.querySelector('.katex-mathml')||answerbutton.querySelector('span:last-child');
            if (answer) {
                possible_answers.push(answer);
            }
        });

        
        possible_answers.forEach(answer => {
          correct_answers.forEach(correct =>{
            if(md(correct.TextTemplate).includes(md(answer.innerText))){
              answer.click()
            }
          })
          
          
            return
        });
      }else if(field.ComponentTypeCode==="FILL_IN_GAPS_COMPONENT"){
        //if the field is a drag and drop answer
      
        let gaps = document.querySelectorAll(' .fitg-drop-content .dropzone-answer')
        gaps.forEach(dropzone => {
          let foundgap = field.Gaps.find(gap => gap.ID.toString() === dropzone.id)
          dropzone.innerHTML = foundgap.CorrectOptions[0]

        })
        return

      }else if(field.ComponentTypeCode==="DROPDOWN_COMPONENT"){

        let select = document.querySelectorAll('#question-container-group select')
        select[dropdown_index].querySelectorAll('option').forEach((option)=>{
          let match = field.Options.find(drop =>  drop.Correct=='true')
          if(md(match.Description) === md(option.innerText)||""){
              
            select[index].value = option.innerText;
          }
        })
        dropdown_index = dropdown_index + 1
        var onchange = new Event('change', { bubbles: true });
        select[index].dispatchEvent(onchange);
      
        
      }else if(field.ComponentTypeCode==="TEXT_BOX_COMPONENT"){    
          let inputbox = document.querySelectorAll('#question-container-group input.text-box-component')
          inputbox[textbox_index].value = field.Options[0]
          textbox_index = textbox_index + 1
        

      }else if(field.ComponentTypeCode==="LONG_ANSWER_COMPONENT"){
        //if the field is for a long answer
        let placeholder = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,<br> sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        
        if(true){ //user wants to pause for self submission answer thing idk
          let textentry = document.querySelector('#question-container-group .ProseMirror')
          let instruction_lines = document.querySelectorAll('#question-container-group > div > p');
          let instructions
          instruction_lines.forEach((line) => {
              instructions += line.innerText;
              
          });


          if(false){
              (async function() {
                await ChatGPT('sk-xxx', instructions)
                    .then(response => {
                    textentry.innerText = response
                  })
                  .catch(error => {
                    textentry.innerText = ''
                  });
              })();
            
          }else if(true){
            let placecopy = placeholder
            if(field.KeywordMatches){
              field.KeywordMatches.forEach((keyword) =>{
                placecopy = placecopy + md(keyword.Options[0].Text)+"  "

              })
            }
            textentry.innerText = placecopy
          }else if(false){
            textentry.innerText = ''
          }
        }
      }else if(field.ComponentTypeCode==="SCRATCH_PAD_COMPONENT"||field.ComponentTypeCode==="FILE_UPLOADER_COMPONENT"||field.ComponentTypeCode==="FREEFORM_WORKING_COMPONENT"){
        //prevent_submission = true
        //submit_blue_section()
      }
    });
    if(!prevent_submission){
      setTimeout(() => {
        console.log('sub2')
       next(nextcode)
       
      }, 500);
    
    }
    




  }else if (document.getElementsByClassName("game-action-bar sa-action-bar information").length > 0) { 
    //if the current question is an orange themed information slide
      next(1)
      return
  }

}
let active = false
document.addEventListener('keydown', function(event) {
  if (event.altKey && event.key === 's') {
    console.log('aaaaaa')
    if(active){
      active = false
    }else{
      active = true
    
    }
    alert(`Education perfect completer STATUS: ${active}`)
    event.preventDefault();
  }
});

const intervalId = setInterval(cycle, 2000);