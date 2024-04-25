import requests

class MailgunMailer:
    def __init__(self, domain_name, api_key):
        self.domain_name = domain_name
        self.api_key = api_key
        self.base_url = f"https://api.mailgun.net/v3/{domain_name}/messages"

    def send_email(self, from_email, to_email, subject, text):
        response = requests.post(
            self.base_url,
            auth=("api", self.api_key),
            data={
                "from": from_email,
                "to": to_email,
                "subject": subject,
                "text": text
            })
        return response
