const gcloud = require('gcloud')
const request = require('request');
const sanitizeHtml = require('sanitize-html')
const xmlbuilder = require('xmlbuilder');

function fetchAudioFromMS (accessToken, content) {
  /**
   *  Refer to https://docs.microsoft.com/zh-tw/azure/cognitive-services/speech-service/quickstart-nodejs-text-to-speech
   */
  const xml_body = xmlbuilder.create('speak')
    .att('version', '1.0')
    .att('xml:lang', 'zh-TW')
    .ele('voice')
    .att('xml:lang', 'zh-TW')
    .att('name', 'Microsoft Server Speech Text to Speech Voice (zh-TW, Zhiwei, Apollo)')
    .ele('prosody')
    .att('rate', '+47.00%')
    // .att('contour', '(80%, -5%) (90%, -15%)')
    .txt(content)
    .end();
  const body = xml_body.toString();
  console.log('yeah')
  const options = {
    method: 'POST',
    baseUrl: 'https://eastasia.tts.speech.microsoft.com/',
    url: 'cognitiveservices/v1',
    headers: {
        'Authorization': 'Bearer ' + accessToken,
        'cache-control': 'no-cache',
        'User-Agent': 'YOUR_RESOURCE_NAME',
        'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
        'Content-Type': 'application/ssml+xml'
    },
    body: body
  };

  function convertText(error, response, body){
    if (!error && response.statusCode == 200) {
      console.log(`Converting text-to-speech. Please hold...\n`)
    } else {
      throw new Error(error);
    }
    console.log('Your file is ready.\n')
  }
  return request(options, convertText)
}

function initBucket (config) {
  const gcs = gcloud.storage({
    projectId: config.projectId,
    keyFilename: config.keyFilename,
  })
	return gcs.bucket(config.bucket);
}

function goThroughAuth (subscriptionKey) {
  const authOpts = {
    method: 'POST',
    uri: 'https://eastasia.api.cognitive.microsoft.com/sts/v1.0/issueToken',
    headers: { 'Ocp-Apim-Subscription-Key': subscriptionKey }
  };  
  return new Promise((resolve, reject) => {
    request(authOpts, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(body)
      } else {
        console.error('Fetch token from eastasia.api.cognitive.microsoft.com in fail.')
        reject(error)
      }
    })
  })
}

const GCS_DIR = 'assets/audios';
function uploadFileToBucket (gcsConfig, identifier, subscriptionKey, content) {
  return new Promise((resolve, reject) => {
    return goThroughAuth(subscriptionKey)
    .then(token => { 
      const bucket = initBucket(gcsConfig);
      const destination = `${GCS_DIR}/${identifier}.wav`
      const file = bucket.file(destination);
      const metadata = {
        filetype: 'audio/wav',
        isPublicRead: true,
        cacheControl: 'public, max-age=3600',
      }

      const trimmedContent = sanitizeHtml(content, {
        allowedTags: [],
        allowedAttributes: {},
      })

      fetchAudioFromMS(token, trimmedContent)
      .pipe(file.createWriteStream({ metadata, }))
			.on('error', err => {
				console.error(err);
				reject(err);
			})
			.on('finish', () => {
        console.log('finish uploading to bucket with destionation:', destination);
				file.makePublic((err, apiResponse) => {
					if (err) {
						return reject(err);
					}
					resolve(apiResponse);
				});
			});
    })
    .catch(err => {
      reject(err);
    })    
  })
}

function delFileFromBucket (gcsConfig, identifier) {
  return new Promise((resolve, reject) => {
    const bucket = initBucket(gcsConfig);
    const destination = `${GCS_DIR}/${identifier}.wav`;
    bucket.deleteFiles({
      prefix: destination,
    }, deleteErr => {
      if (deleteErr) {
        return reject(deleteErr);
      }
      resolve();
    });    
  })
}

module.exports = {
  uploadFileToBucket,
  delFileFromBucket,
}
