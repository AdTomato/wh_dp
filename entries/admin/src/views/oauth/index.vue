<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OAuthApi from '../../apis/oauth';
import { parseUrlParam } from '../../common/utils';
import env from '../../env';

@Component({
  name: 'oauth'
})
export default class OAuth extends Vue {
  code: string | null = null;
  created() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expireTime');
    this.getOauthCode();
    this.getOAuthToken();
  }
  render(h:any) {

  }

  getOauthCode() {
    this.code = parseUrlParam(window.location.href, 'code');
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

    localStorage.setItem('refresh_token', refresh_tokens);
    localStorage.setItem('expireTime', expireTime);
    // const expires = res.data.expires_in;
    localStorage.setItem('token', token);
    // 登陆成功，获取用户信息
    this.$router.push({ name: 'orguser' });
  }
}

</script>
