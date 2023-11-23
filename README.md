# Edkit Justiz email reporting

[Österreichischen Justiz Website](https://edikte.justiz.gv.at/edikte/ex/exedi3.nsf/Suche!OpenForm) regularly updates its reports, providing daily listings with the option to access information from up to a week ago.

This project entails generating a weekly email report that will be sent to a customized list of recipients.

## How to use

This is a private repository, and the code isn't open source, but if you are bad ass, you can fork it at your own risk and setup the secrets on your own repository.

## Configuration

| Github Secrets                        | Description                                                  |
|--------------------------------------|--------------------------------------------------------------|
| `INCLUDE_ADDRESS_AND_CATEGORY_FILTER`| Comma-separated list of keywords to filter as alerts          |
| `MAIL_USERNAME`                      | Gmail username used for login to send the email               |
| `MAIL_PASSWORD`                      | Gmail application password used for login into Gmail          |
| `MAIL_TO`                            | Comma-separated list of email addresses to send the report to |

> `MAIL_PASSWORD` is a generated and unique app password for tyour gmail account, [read more](https://support.google.com/accounts/answer/185833?hl=en).