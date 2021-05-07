const axios = require('axios');

class TwoCaptcha {
  apiKey = '';
  axios;

  constructor(apiKey) {
    this.apiKey = apiKey;
    this.initAxios();
  }

  initAxios() {
    this.axios = axios.create({ baseURL: 'https://api.capmonster.cloud' });
  }

  async createTask(captchaKey, pageUrl) {
    try {
      const taskInfo = (await this.axios.post('/createTask', {
        clientKey: this.apiKey,
        task: {
          type: 'NoCaptchaTaskProxyless',
          websiteURL: pageUrl,
          websiteKey: captchaKey
        }
      })).data;
      if (!taskInfo) {
       return {
          success: false,
          errorMessage: 'Unknown error, no response',
          taskId: null
        }
      }
      if (taskInfo.errorId) {
        throw new Error(taskInfo.errorDescription);
      }
      return {
        success: true,
        errorMessage: '',
        taskId: taskInfo.taskId
      }
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message,
        taskId: null
      }
    }
  }

  async getTaskResult(taskId) {
    try {
      const taskInfo = (await this.axios.post('/getTaskResult', {
        clientKey: this.apiKey,
        taskId: taskId
      })).data;
      if (!taskInfo || taskInfo.status === 'processing') {
        return {
          error:true,
          complete: false,
          errorMessage: 'Unknown error, no response',
          captcha: null
        }
      }
      if (taskInfo.errorId && taskInfo.status === 'ready') {
        throw new Error(taskInfo.errorDescription);
      }
      return {
        error: false,
        complete: true,
        errorMessage: '',
        captcha: taskInfo.solution.gRecaptchaResponse
      }
    } catch (error) {
      return {
        error: true,
        complete: true,
        errorMessage: error.message,
        captcha: null
      }
    }
  }

  async solveCaptcha(captchaKey, pageUrl) {
    const taskRequest = await this.createTask(captchaKey, pageUrl);
    if (!taskRequest.success) {
      throw new Error('Error during task creating: ' + taskRequest.errorMessage);
    }

    const taskId = taskRequest.taskId;
    console.log('created reCAPTCHA task with id: ' + taskId);

    return await new Promise((resolve, reject) => {
      let attempts = 0;
      const pollingInterval = setInterval(async () => {
        let taskResult = await this.getTaskResult(taskId);
        if (attempts++ % 30 === 0) {
          console.log(`reCAPTCHA ${taskId}: ${attempts}/120 attempts`);
          if (attempts > 120) {
            console.log(`reCAPTCHA ${taskId}: timeout.`);
            clearInterval(pollingInterval);
            reject('120 attempts, no response for captcha');
          }
        }
        if (taskResult.complete && !taskResult.error) {
          resolve(taskResult.captcha);
          clearInterval(pollingInterval);
        } else if (taskResult.complete && taskResult.error) {
          reject(taskResult.errorMessage);
          clearInterval(pollingInterval);
        }
      }, 1000);
    });
  }
}

module.exports = TwoCaptcha;
