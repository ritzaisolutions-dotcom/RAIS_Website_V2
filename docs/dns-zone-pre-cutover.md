# DNS snapshot before cutover

Captured: 2026-07-29T20:06:15.5174136+02:00

NOTE: This is a dig-style check, not a full Hostinger zone export. Export the complete zone in Hostinger before changing A/CNAME.

### ritz-ai.solutions NS
```
Name     : ritz-ai.solutions
Type     : NS
TTL      : 43200
Section  : Answer
NameHost : ns1.dns-parking.com

Name     : ritz-ai.solutions
Type     : NS
TTL      : 43200
Section  : Answer
NameHost : ns2.dns-parking.com


Name       : ns1.dns-parking.com
QueryType  : A
TTL        : 6175
Section    : Additional
IP4Address : 162.159.24.201


Name       : ns1.dns-parking.com
QueryType  : AAAA
TTL        : 4988
Section    : Additional
IP6Address : 2400:cb00:2049:1::a29f:18c9


Name       : ns2.dns-parking.com
QueryType  : A
TTL        : 14110
Section    : Additional
IP4Address : 162.159.25.42


Name       : ns2.dns-parking.com
QueryType  : AAAA
TTL        : 5247
Section    : Additional
IP6Address : 2400:cb00:2049:1::a29f:192a
```

### ritz-ai.solutions SOA
```
Name              : ritz-ai.solutions
Type              : SOA
TTL               : 3600
PrimaryServer     : ns1.dns-parking.com
NameAdministrator : dns.hostinger.com
SerialNumber      : 2026072301
```

### ritz-ai.solutions A
```
Name       : ritz-ai.solutions
Type       : A
TTL        : 14400
DataLength : 4
Section    : Answer
IPAddress  : 72.60.133.250
```

### ritz-ai.solutions AAAA
```
Name              : ritz-ai.solutions
Type              : SOA
TTL               : 600
PrimaryServer     : ns1.dns-parking.com
NameAdministrator : dns.hostinger.com
SerialNumber      : 2026072301
```

### ritz-ai.solutions MX
```
Name         : ritz-ai.solutions
Type         : MX
TTL          : 14400
NameExchange : mx1.hostinger.com
Preference   : 5

Name         : ritz-ai.solutions
Type         : MX
TTL          : 14400
NameExchange : mx2.hostinger.com
Preference   : 10
```

### ritz-ai.solutions TXT
```
Name    : ritz-ai.solutions
Type    : TXT
TTL     : 3600
Strings : {v=spf1 include:_spf.mail.hostinger.com include:_spf.reach.hostinger.com ~all}
```

### _dmarc.ritz-ai.solutions TXT
```
Name    : _dmarc.ritz-ai.solutions
Type    : TXT
TTL     : 3600
Strings : {v=DMARC1; p=none}
```

### www.ritz-ai.solutions CNAME
```
Name     : www.ritz-ai.solutions
Type     : CNAME
TTL      : 300
Section  : Answer
NameHost : ritz-ai.solutions
```

### www.ritz-ai.solutions A
```
Name     : www.ritz-ai.solutions
Type     : CNAME
TTL      : 300
Section  : Answer
NameHost : ritz-ai.solutions


Name       : ritz-ai.solutions
QueryType  : A
TTL        : 14399
Section    : Answer
IP4Address : 72.60.133.250
```

## Vercel-requested DNS (from `vercel domains add/inspect`) — DO NOT APPLY WITHOUT APPROVAL

Current apex A: `72.60.133.250` (old VPS / Hostinger)
Current www: CNAME → `ritz-ai.solutions`
Current MX: `mx1.hostinger.com` (5), `mx2.hostinger.com` (10)
Current SPF: `v=spf1 include:_spf.mail.hostinger.com include:_spf.reach.hostinger.com ~all`
Current DMARC: `v=DMARC1; p=none`
NS: `ns1.dns-parking.com`, `ns2.dns-parking.com` (Hostinger)

Related subdomains already on other Vercel projects (leave alone):
- `portal.ritz-ai.solutions` → rais-kundenportal
- `tracker.ritz-ai.solutions` → effizienz-tracker-rais

### Safe cutover proposal (website only)

1. In Hostinger DNS, **export the full zone** first (this dig snapshot is incomplete for DKIM selectors; none of the common selectors resolved in this check).
2. Change only website records as Vercel currently requests:
   - Apex `A` for `ritz-ai.solutions` → `76.76.21.21`
   - `www` `A` for `www.ritz-ai.solutions` → `76.76.21.21` (replace the existing CNAME to apex)
3. **Do not** switch nameservers to `ns1.vercel-dns.com` / `ns2.vercel-dns.com` unless mail records are fully rebuilt on Vercel DNS.
4. Leave untouched: MX, SPF/TXT, DMARC, DKIM, CAA, and subdomain records for `portal.` / `tracker.`.

### After approval and change

- `dig ritz-ai.solutions A` should show `76.76.21.21`
- `dig ritz-ai.solutions MX` must still show Hostinger MX
- Site should load at https://ritz-ai.solutions and https://www.ritz-ai.solutions

