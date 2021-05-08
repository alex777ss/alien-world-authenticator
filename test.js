const { waxApi } = require('./src/service');

async function test() {
  const response = await waxApi.request({
    method: 'GET',
    url: `https://public-wax-on.wax.io/wam/users`,
    headers: {
      'x-access-token': 'fzXC7igGIOHXVxRROTVgnbcGWu05drUpsNUxroBn'
    }
  })
  console.log(response);
}

test();
