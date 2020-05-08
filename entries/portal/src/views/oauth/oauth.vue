<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OAuthApi from '@/apis/oauth';
import { utils } from '@cloudpivot/common';
import env from '@/config/env';

@Component({
  name: 'OAuth'
})
export default class OAuth extends Vue {
  code: string | null = null;

  created() {
    console.log('oauth');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expireTime');
    sessionStorage.removeItem('user');
    this.getOauthCode();
  }

  render(h:any) {

  }

  getOauthCode() {
    this.code = utils.parseUrlParam(window.location.href, 'code');
    if (this.code) {
      this.getOAuthToken();
    }
  }

  async getOAuthToken() {
    const params: OAuth.RequestParams = {
      client_id: `${env.client_id}`,
      client_secret: `${env.secret}`,
      grant_type: 'authorization_code',
      redirect_uri: `${env.redirectHost}/oauth`,
      code: this.code,
    };
    const res = await OAuthApi.getSSOToken(params);
    const token = (res as any).access_token;
    const refresh_tokens = (res as any).refresh_token;
    const expireTime = (res as any).exp;
    // const expires = res.data.expires_in;
    localStorage.setItem('refresh_token', refresh_tokens);
    localStorage.setItem('expireTime', expireTime);
    localStorage.setItem('token', token);
    this.$router.push({ name: 'myUnfinishedWorkItem' });
  }
}

</script>
