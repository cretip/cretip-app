# 🔐 Security Policy

Cretip handles creator profiles, tipping activity, wallet addresses, API data, and Soroban smart contract logic. Please report suspected vulnerabilities privately so maintainers can investigate and protect users before details become public.

## 📣 Reporting a Vulnerability

If you discover a security issue, please do **not** open a public GitHub issue, pull request, or discussion with exploit details.

Instead, email the maintainers at:

```text
security@cretip.dev
```

Please include as much of the following as you can:

- A short summary of the issue
- The affected area, such as `backend`, `frontend`, `contract`, wallet flow, API endpoint, or documentation
- Steps to reproduce the issue
- Expected impact, including whether user funds, wallet addresses, creator data, or API data may be affected
- Any logs, screenshots, transaction examples, or proof-of-concept details that help maintainers verify the report

## ⚠️ What to Report Privately

Please use private disclosure for issues such as:

- Smart contract flaws that could affect tipping logic, balances, authorization, or transaction validation
- API vulnerabilities, including authentication bypass, data exposure, injection, or unsafe input handling
- Wallet integration issues that could mislead users, expose addresses unexpectedly, or trigger unsafe signing behavior
- Leaked secrets, private keys, tokens, environment variables, or deployment credentials
- Cross-site scripting, phishing vectors, dependency vulnerabilities, or unsafe frontend behavior

## ✅ What Can Be Public

General bugs, documentation fixes, feature requests, and non-sensitive UI problems can still be reported through normal GitHub issues.

If you are unsure whether an issue is security-sensitive, please report it privately first. Maintainers can move it to a public issue later if it is safe to discuss openly.

## 🛡️ Responsible Disclosure Guidelines

When researching or reporting issues:

- Do not access, modify, delete, or exfiltrate data that does not belong to you
- Do not attempt to drain funds, interrupt service, spam endpoints, or attack users
- Use test accounts, local development environments, or testnet flows whenever possible
- Give maintainers reasonable time to investigate and ship a fix before public disclosure
- Keep vulnerability details private until maintainers confirm disclosure is safe

## 🧭 Maintainer Response

After receiving a report, maintainers will aim to:

1. Acknowledge the report as soon as practical
2. Triage the severity and affected components
3. Work on a fix or mitigation
4. Credit the reporter if they want public recognition and disclosure is safe

## 📦 Supported Versions

Cretip is currently an open-source prototype. Security fixes are expected to target the latest code on the `main` branch unless the maintainers publish versioned releases in the future.

## 🙏 Thank You

Responsible reports help keep Cretip safer for creators, fans, and contributors. Thank you for helping improve the security of the project.
