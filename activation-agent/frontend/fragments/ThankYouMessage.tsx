type ThankYouMessageProps = { email: string; tweet: string }

export const ThankYouMessage = ({ email }: ThankYouMessageProps) => (
  <div style='text-align: center'>
    <h3 style='margin-bottom: 20px; color: #EF6F1C; text-align: center'>
      Thank You!
    </h3>
    <p style='margin-bottom: 25px'>
      For details regarding your payment, please check your
      <strong>{` ${email}`}</strong> inbox.
    </p>
  </div>
)
