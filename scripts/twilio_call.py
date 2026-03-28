#!/usr/bin/env python3
import os, sys, base64, urllib.parse, urllib.request
from urllib.error import HTTPError

def eprint(*a):
    print(*a, file=sys.stderr)

def main():
    if len(sys.argv) < 2:
        eprint('Usage: twilio_call.py <to_e164> [message] [language=pt-PT] [voice=alice]')
        return 2

    to_n = sys.argv[1]
    msg  = sys.argv[2] if len(sys.argv) > 2 else 'Atenção: esta é uma chamada de teste.'
    lang = sys.argv[3] if len(sys.argv) > 3 else 'pt-PT'
    voice= sys.argv[4] if len(sys.argv) > 4 else 'alice'

    sid = os.environ.get('TWILIO_ACCOUNT_SID')
    token = os.environ.get('TWILIO_AUTH_TOKEN')
    from_n = os.environ.get('TWILIO_FROM_NUMBER') or os.environ.get('TWILIO_PHONE_NUMBER')

    missing = [k for k,v in {
        'TWILIO_ACCOUNT_SID': sid,
        'TWILIO_AUTH_TOKEN': token,
        'TWILIO_FROM_NUMBER or TWILIO_PHONE_NUMBER': from_n,
    }.items() if not v]
    if missing:
        raise SystemExit('Missing env vars: ' + ', '.join(missing))

    twiml = f'<Response><Say voice="{voice}" language="{lang}">{msg}</Say></Response>'

    data = urllib.parse.urlencode({'To': to_n, 'From': from_n, 'Twiml': twiml}).encode()
    req = urllib.request.Request(
        f'https://api.twilio.com/2010-04-01/Accounts/{sid}/Calls.json',
        data=data,
        method='POST',
    )
    auth = base64.b64encode(f'{sid}:{token}'.encode()).decode()
    req.add_header('Authorization', 'Basic ' + auth)
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')

    try:
        with urllib.request.urlopen(req) as r:
            print(r.read().decode())
    except HTTPError as e:
        eprint('HTTP', e.code, e.reason)
        eprint(e.read().decode())
        return 1

    return 0

if __name__ == '__main__':
    raise SystemExit(main())
