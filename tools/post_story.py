"""Post story/today.png to Instagram as a Story.
Needs env IG_TOKEN (Instagram long-lived user token, Instagram Login) and IMAGE_URL (public URL of the png).
The token is never printed."""
import os, sys, json, time, hashlib, urllib.request, urllib.parse

API = 'https://graph.instagram.com/v25.0'
tok = os.environ.get('IG_TOKEN', '').strip()
img = os.environ['IMAGE_URL']
if not tok:
    print('IG_TOKEN not set: skipping Instagram.'); sys.exit(0)

def call(method, path, **params):
    params['access_token'] = tok
    q = urllib.parse.urlencode(params)
    url = f'{API}/{path}' if path.startswith(('me', '1', '2', '3', '4', '5', '6', '7', '8', '9')) else path
    req = urllib.request.Request(url + ('?' + q if method == 'GET' else ''), data=None if method == 'GET' else q.encode(), method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as r: return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf8', 'replace').replace(tok, '***')
        sys.exit(f'Instagram said {e.code}: {body}')

me = call('GET', 'me', fields='user_id,username')
uid = me['user_id']
print('Posting as', me.get('username'))
c = call('POST', f'{uid}/media', media_type='STORIES', image_url=img)
cid = c['id']
for _ in range(30):
    s = call('GET', cid, fields='status_code')
    if s.get('status_code') == 'FINISHED': break
    if s.get('status_code') == 'ERROR': sys.exit('Instagram could not process the image.')
    time.sleep(5)
p = call('POST', f'{uid}/media_publish', creation_id=cid)
print('Story published, media id', p.get('id'))

# Keep the token alive: refresh (valid 60 more days). If Instagram hands back a different
# token string, the stored secret must be replaced, so fail loudly to send Wei an email.
r = call('GET', 'https://graph.instagram.com/refresh_access_token', grant_type='ig_refresh_token')
days = int(r.get('expires_in', 0)) // 86400
print(f'Token refreshed, valid about {days} more days.')
if r.get('access_token') and hashlib.sha256(r['access_token'].encode()).digest() != hashlib.sha256(tok.encode()).digest():
    sys.exit('Instagram issued a new token string. Generate a token again in the Meta app dashboard and replace the IG_TOKEN secret.')
