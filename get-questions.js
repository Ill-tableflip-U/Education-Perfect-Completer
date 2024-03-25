export async function init(){
    let ep_raw_session = await fetch("https://services.educationperfect.com/legacy/session", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-AU,en;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-GB;q=0.6,en-US;q=0.5",
        "content-type": "application/json",
        "ep-require-preflight": "1",
        "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      },
      "referrer": "https://app.educationperfect.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"ApplicationId\":\"EducationPerfectPro\",\"LtiLaunchEventId\":null}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    let ep_session = await ep_raw_session.json()
    let ep_sessionId = ep_session.SessionId
    
    
    const urlParts = new URL(window.location.href);
    
    const ep_activityId = urlParts.pathname.split("/")[4];
    const ep_taskId = urlParts.searchParams.get("task");
    
    let ep_raw_questionIds = await fetch(
      "https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.GetStructuredActivityAndAttempts2",
      {
        headers: {
          accept: "*/*",
          "accept-language":
            "en-AU,en;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-GB;q=0.6,en-US;q=0.5",
          "content-type": "application/json; charset=UTF-8",
          "sec-ch-ua":
            '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        referrer: "https://app.educationperfect.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: `{\"id\":${Math.floor(Math.random() * (9999 - 1001 + 1)) + 1001},\"method\":\"nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.GetStructuredActivityAndAttempts2\",\"params\":[${ep_sessionId},{\"ActivityID\":${ep_activityId},\"TaskID\":${ep_taskId}}]}`,
        method: "POST",
        mode: "cors",
        credentials: "omit",
      }
    );
    let ep_questionIds = await ep_raw_questionIds.json();
    let total_ep_questionIds = []
    for (const ep_section of ep_questionIds.result.Activity.Structure.Children) {
        total_ep_questionIds = total_ep_questionIds.concat(ep_section.ContentIDs)
    }
    
    
    let ep_raw_questions = await fetch("https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.GetQuestionsWithOptimisedMedia", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-AU,en;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-GB;q=0.6,en-US;q=0.5",
        "content-type": "application/json; charset=UTF-8",
        "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      },
      "referrer": "https://app.educationperfect.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": `{\"id\":${Math.floor(Math.random() * (9999 - 1001 + 1)) + 1001},\"method\":\"nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.GetQuestionsWithOptimisedMedia\",\"params\":[${ep_sessionId},[${total_ep_questionIds.toString()}]]}`,
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    });
    return await ep_raw_questions.json();
    }