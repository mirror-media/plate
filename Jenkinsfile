import groovy.json.JsonOutput

node {
    def project = 'mirrormedia-1470651750304'
    def appName = 'keystone-plate'
    def imageTag = "gcr.io/${project}/${appName}"

    def build_time 
    def git_author_mail
    def git_author_name
    def slack_user

    stage('Pre-build Setup') {
        // checkout([$class: 'GitSCM', branches: [[name: '*/dev']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'AuthorInChangelog']], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/ichiaohsu/plate-vue']]])
        try {
            checkout scm
            
            git_author_mail = sh(
                script: "git log --skip 1 -n 1 --pretty=%aE",
                returnStdout: true
            ).trim()
            
            git_author_name = sh(
                script: "git log --skip 1 -n 1 --pretty=%an",
                returnStdout: true
            ).trim()

            sh("echo git pushed by ${git_author_name} ${git_author_mail}")

            slack_user = slackUsers(git_author_mail)
            sh("echo slack target: ${slack_user}")

            sh("git clone -b master https://github.com/mirror-media/keystone-docker.git")

            sh("gcloud source repos clone default --project=mirrormedia-1470651750304")
            sh("cp default/keystone/config.js keystone-docker/")
            sh("cp default/keystone/gcskeyfile.json keystone-docker/")
            
        } catch(e) {
            // slackSend (color: '#FF0000', message: "Huston, we got a *pre-build* problem.")
            notifySlack("",[
                [
                    color: "#FF0000",
                    title: "Pre-build FAILED",
                    text: "Houston, we have a pre-build problem\n```${e.getMessage()}```",
        			mrkdwn_in: ["text"]
    		    ]
            ])
            currentBuild.result = 'FAILURE'
            throw e
        }

        // slackSend (color: '#C5C9CC', message: "*${git_author_name}* gave *${appName}* a little push. Let the build begin!")
        notifySlack("",[
            [
                color: "#C5C9CC",
                title: "Pre-build Success",
                text: "*${git_author_name}* gave *${appName}* a little push. Let the build begin!",
                mrkdwn_in: ["text"]
            ]
        ])
    }
    
    stage('Build'){
        dir("./keystone-docker"){
            try {
                build_time = sh(
                    script: "date +%Y-%m-%d_%H%M%S",
                    returnStdout: true
                ).trim()
                // sh("date +%Y-%m-%d_%H%M%S > .finishtime")
                // build_time = readFile '.finishtime'
                sh("docker build --no-cache -t ${imageTag}:${slack_user}_${build_time} .")
                // sh("echo ${build_time}")
                
                sh("gcloud docker -- push ${imageTag}:${slack_user}_${build_time}")
            } catch(e) {
                // slackSend (color: '#FF0000', message: "@${slack_user}, we got a *build* problem.")
                notifySlack("",[
                    [
                        color: "#FF0000",
                        title: "Build FAILED",
                        text: "Houston, we have a build problem\n```${e.getMessage()}```",
            			mrkdwn_in: ["text"]
        		    ]
                ])
                currentBuild.result = 'FAILURE'
                throw e
            }
            
            // slackSend (color: '#BDFFC3', message: "${imageTag}:${slack_user}_${build_time}\nBuilt *SUCCESS*.\n Make NEWS great again!")
            notifySlack("",[
                [
                    color: "#3A7BD1",
                    title: "Build Success",
                    text: "Build <https://${imageTag}:${slack_user}_${build_time}|${slack_user}_${build_time}> done.\n Make NEWS great again!",
        			mrkdwn_in: ["text"]
    		    ]
            ])
        }
    }

    stage("Deploy") {
        try {
           // Deploy to dev
           sh("kubectl set image deploy/keystone-deploy keystone-plate=${imageTag}:${slack_user}_${build_time}")
           // Watch until rollout success
           sh("kubectl rollout status deployment/keystone-deploy -w")

           sh("sleep 30s")

        } catch(e) {
           //slackSend (color: '#FF0000', message: "Huston, we got a *deploy* problem.")
           notifySlack("",[
                    [
                        color: "#FF0000",
                        title: "Deploy FAILED",
                        text: "Houston, we have a *deploy* problem\n```${e.getMessage()}```",
            			mrkdwn_in: ["text"]
        		    ]
                ])
            currentBuild.result = 'FAILURE'
            throw e
        }
        
        //slackSend (color: '#FCE028', message: "@${slack_user}, you've got build. Check out https://dev.mirrormedia.mg")
        notifySlack("",[
            [
                color: "#3A7BD1",
                title: "Deploy Success",
                text: "@${slack_user}, you have a <http://35.189.183.129:3000|new Keystone>.",
        		mrkdwn_in: ["text"]
    	    ]
        ])
    }
}

def notifySlack(text, attachments) {
    def slackURL = 'https://hooks.slack.com/services/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'
    def jenkinsIcon = 'https://avatars3.githubusercontent.com/u/6118534?v=3&s=200'

    def payload = JsonOutput.toJson([text: text,
        channel: "#jenkins",
        username: "keystone-plate",
        link_names: true,
        icon_url: jenkinsIcon,
        attachments: attachments
    ])

    
    sh "curl -X POST --data-urlencode \'payload=${payload}\' ${slackURL}"
}

def slackUsers(git_email){
    switch(git_email){
        case "chiangkaichih@gmail.com":
            return "chiangkeith"
        case "lion15945@gmail.com":
            return "kwhsiung"
        case "hcchien@gmail.com":
            return "hcchien"
        case "tempo0829@gmail.com":
            return "noah.tan"
        case "ichiao.hsu@gmail.com":
            return "mmich"
        default:
            return "hcchien"
    }
}