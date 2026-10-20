# MDaemon preset

`DAV_PRESET=mdaemon` is the default. It builds the WebDAV paths used by MDaemon from `DAV_BASE_URL` (`https://MAIL_HOST` by default).

## URLs

| Item | URL |
|---|---|
| Calendar alias | `/webdav/calendar` |
| Address book alias | `/webdav/addressbook` |
| Task list alias | `/webdav/tasklist` |
| Principal | `/webdav/principals/{email}/` |
| Calendar | `/webdav/caldav/{domain}/{local}/b64=Q2FsZW5kYXI/` |
| Tasks | `/webdav/caldav/{domain}/{local}/b64=VGFza3M/` |
| Contacts | `/webdav/carddav/{domain}/{local}/b64=Q29udGFjdHM/` |

The `b64=` segments are base64 of the folder names `Calendar`, `Tasks` and `Contacts`. Discovery uses `/.well-known/caldav` and `/.well-known/carddav`. For `jane.doe@example.com` the calendar URL is `https://mail.example.com/webdav/caldav/example.com/jane.doe/b64=Q2FsZW5kYXI/`.

## Behaviour

- Login is the full email address everywhere (IMAP, SMTP, DAV).
- Shared "[Public]" calendars, tasks and contacts appear automatically on Apple devices and DAVx5. For Outlook (CalDAV Synchronizer) and Thunderbird, use the discovery URL.
- A new account only has the INBOX and Spam folders; other folders are created by the mail client.
- Tips prefixed `[mdaemon] ` in `guides.js` and the FAQ entry marked `data-preset="mdaemon"` in `index.html` are shown only with this preset.

## Overriding

Any URL can be replaced individually, for example `DAV_CALENDAR_URL_TEMPLATE`. Templates accept `{email}`, `{local}` and `{domain}`, lower-cased.

## Other servers

Set `DAV_PRESET=generic` to fall back to `.well-known` discovery for every DAV URL, then override what your server needs. See [configuration.md](configuration.md).
