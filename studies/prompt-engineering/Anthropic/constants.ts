export const unclearPrompt1 =
  "이 고객 피드백 메시지에서 모든 개인 식별 정보를 제거해 주세요: {{FEEDBACK_DATA}}";

export const clearPrompt1 = `귀하의 과제는 분기별 검토를 위해 고객 피드백을 익명화하는 것입니다.

지시사항:
1. 모든 고객 이름을 “CUSTOMER_[ID]“로 대체하세요 (예: “Jane Doe” → “CUSTOMER_001”).
2. 이메일 주소를 “EMAIL_[ID]@example.com”으로 대체하세요.
3. 전화번호를 “PHONE_[ID]“로 수정하세요.
4. 메시지가 특정 제품(예: “AcmeCloud”)을 언급하면 그대로 두세요.
5. PII가 발견되지 않으면 메시지를 그대로 복사하세요.
6. 처리된 메시지만 출력하고, ”---“로 구분하세요.

처리할 데이터: {{FEEDBACK_DATA}}`;

const testPrompt = '1234 \n 1234 \n 1234'