Frontend CSP Audit
Target: http://localhost:5173/
Initial result: HTTP 200 OK; no Content-Security-Policy header observed.
Finding: CSP header was not configured on the Vite development-server response.
Remediation: Added CSP and X-Content-Type-Options headers to the Vite development-server configuration.
Retest: Re-run curl.exe -I http://localhost:5173/ and record the actual result.

PS C:\React-basics\REST\frontend> npm audit
found 0 vulnerabilities