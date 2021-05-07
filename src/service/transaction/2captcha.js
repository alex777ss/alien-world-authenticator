const axios = require('axios');

class TwoCaptcha {
  apiKey = '';
  axios;

  constructor(apiKey) {
    this.apiKey = apiKey;
    this.initAxios();
  }

  initAxios() {
    this.axios = axios.create({ baseURL: 'http://2captcha.com' })
    this.axios.interceptors.request.use(config => {
      if (!config.params) {
        config.params = {}
      }
      config.params.key = this.apiKey;
      config.params.json = 1;
      return config;
    }, error => {
      return Promise.reject(error);
    })
  }

  async createTask(captchaKey, pageUrl) {
    return (await this.axios.post('/in.php', null, {
      params: {
        method: 'userrecaptcha',
        googlekey: captchaKey,
        pageurl: pageUrl
      }
    })).data;
  }

  async getTaskResult(taskId) {
    return (await this.axios.get('/res.php', {
      params: {
        action: 'get',
        id: taskId
      }
    })).data;
  }

  async solveCaptcha(captchaKey, pageUrl) {
    const taskRequest = await this.createTask(captchaKey, pageUrl);
    if (taskRequest.status !== 1 || !taskRequest.request) {
      throw new Error('Error during task creating: ' + taskRequest.error_text);
    }

    const taskId = taskRequest.request;
    console.log('created reCAPTCHA task with id: ' + taskId);

    return await new Promise((resolve, reject) => {
      const pollingInterval = setInterval(async () => {
        let taskResult = await this.getTaskResult(taskId);
        if (taskResult.status === 1) {
          resolve(taskResult.request);
          clearInterval(pollingInterval);
        } else if (taskResult.request !== 'CAPCHA_NOT_READY') {
          reject(taskResult.error_text);
          clearInterval(pollingInterval);
        }
      }, 4000);
    });
  }
}

module.exports = TwoCaptcha;
