import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'

export default function PrivacyPage() {
   return (
      <div className="min-h-screen">
         <Header />

         <main className="pt-16">
            {/* Hero Section */}
            <section className="relative py-12 bg-gradient-to-r from-emerald-900 to-emerald-700">
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">개인정보 처리방침</h1>
                  <p className="text-lg text-emerald-100">KHAMA의 개인정보 수집 및 이용에 관한 방침입니다</p>
               </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <Card>
                  <div className="prose prose-lg max-w-none">
                     <p className="text-lg font-medium text-gray-900 mb-6">대한생활가전유지관리협회(이하 &quot;협회&quot;)는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고자 다음과 같은 처리방침을 두고 있습니다.</p>

                     <h2>1. 개인정보의 처리목적</h2>
                     <p>협회는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>

                     <ul>
                        <li>
                           <strong>회원가입 및 관리</strong>: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지
                        </li>
                        <li>
                           <strong>자격시험 관리</strong>: 시험 접수, 응시자격 확인, 시험 실시, 합격자 발표, 자격증 발급
                        </li>
                        <li>
                           <strong>교육서비스 제공</strong>: 교육과정 신청 접수, 교육 실시, 수료증 발급
                        </li>
                        <li>
                           <strong>고객상담 및 민원처리</strong>: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보
                        </li>
                        <li>
                           <strong>마케팅 및 광고에의 활용</strong>: 신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공
                        </li>
                     </ul>

                     <h2>2. 개인정보의 처리 및 보유기간</h2>
                     <p>협회는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>

                     <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                           <thead className="bg-gray-50">
                              <tr>
                                 <th className="border border-gray-300 px-4 py-2 text-left">처리목적</th>
                                 <th className="border border-gray-300 px-4 py-2 text-left">보유기간</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td className="border border-gray-300 px-4 py-2">회원가입 및 관리</td>
                                 <td className="border border-gray-300 px-4 py-2">회원탈퇴 시까지</td>
                              </tr>
                              <tr>
                                 <td className="border border-gray-300 px-4 py-2">자격시험 관리</td>
                                 <td className="border border-gray-300 px-4 py-2">자격증 발급 후 5년</td>
                              </tr>
                              <tr>
                                 <td className="border border-gray-300 px-4 py-2">교육서비스 제공</td>
                                 <td className="border border-gray-300 px-4 py-2">교육 완료 후 3년</td>
                              </tr>
                              <tr>
                                 <td className="border border-gray-300 px-4 py-2">고객상담 및 민원처리</td>
                                 <td className="border border-gray-300 px-4 py-2">처리 완료 후 1년</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>

                     <h2>3. 처리하는 개인정보의 항목</h2>
                     <p>협회는 다음의 개인정보 항목을 처리하고 있습니다.</p>

                     <h3>가. 회원가입</h3>
                     <ul>
                        <li>
                           <strong>필수항목</strong>: 이름, 이메일, 비밀번호, 전화번호, 생년월일, 성별, 주소
                        </li>
                        <li>
                           <strong>선택항목</strong>: 마케팅 수신동의
                        </li>
                     </ul>

                     <h3>나. 자격시험 신청</h3>
                     <ul>
                        <li>
                           <strong>필수항목</strong>: 이름, 생년월일, 전화번호, 주소, 교육이수증
                        </li>
                        <li>
                           <strong>자동수집항목</strong>: 접속 IP 정보, 쿠키, 접속 로그, 서비스 이용 기록
                        </li>
                     </ul>

                     <h2>4. 개인정보의 제3자 제공</h2>
                     <p>협회는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서 처리하며, 정보주체의 사전 동의 없이는 본래의 목적 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.</p>

                     <p>다만, 다음의 경우에는 예외로 합니다:</p>
                     <ul>
                        <li>정보주체로부터 별도의 동의를 받는 경우</li>
                        <li>법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우</li>
                        <li>공공기관이 법령 등에서 정하는 소관 업무의 수행을 위하여 불가피한 경우</li>
                        <li>정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 상태에 있거나 주소불명 등으로 사전 동의를 받을 수 없는 경우로서 명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산의 이익을 위하여 필요하다고 인정되는 경우</li>
                     </ul>

                     <h2>5. 개인정보처리의 위탁</h2>
                     <p>협회는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>

                     <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                           <thead className="bg-gray-50">
                              <tr>
                                 <th className="border border-gray-300 px-4 py-2 text-left">위탁받는 자</th>
                                 <th className="border border-gray-300 px-4 py-2 text-left">위탁하는 업무의 내용</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td className="border border-gray-300 px-4 py-2">웹호스팅 업체</td>
                                 <td className="border border-gray-300 px-4 py-2">웹사이트 운영 및 관리</td>
                              </tr>
                              <tr>
                                 <td className="border border-gray-300 px-4 py-2">SMS 발송업체</td>
                                 <td className="border border-gray-300 px-4 py-2">시험 안내 및 결과 통지</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>

                     <h2>6. 정보주체의 권리·의무 및 행사방법</h2>
                     <p>정보주체는 협회에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>

                     <ul>
                        <li>개인정보 처리현황 통지요구</li>
                        <li>개인정보 열람요구</li>
                        <li>개인정보 정정·삭제요구</li>
                        <li>개인정보 처리정지요구</li>
                     </ul>

                     <p>위의 권리 행사는 협회에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 협회는 이에 대해 지체없이 조치하겠습니다.</p>

                     <h2>7. 개인정보의 파기</h2>
                     <p>협회는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>

                     <h3>파기절차</h3>
                     <p>이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</p>

                     <h3>파기방법</h3>
                     <ul>
                        <li>
                           <strong>전자적 파일형태</strong>: 기록을 재생할 수 없도록 로우레벨포멧(Low Level Format) 등의 방법을 이용하여 파기
                        </li>
                        <li>
                           <strong>종이에 출력된 개인정보</strong>: 분쇄기로 분쇄하거나 소각하여 파기
                        </li>
                     </ul>

                     <h2>8. 개인정보의 안전성 확보조치</h2>
                     <p>협회는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.</p>

                     <ul>
                        <li>
                           <strong>개인정보 취급 직원의 최소화 및 교육</strong>: 개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화하여 개인정보를 관리하는 대책을 시행하고 있습니다.
                        </li>
                        <li>
                           <strong>정기적인 자체 감사 실시</strong>: 개인정보 취급 관련 안정성 확보를 위해 정기적(분기 1회)으로 자체 감사를 실시하고 있습니다.
                        </li>
                        <li>
                           <strong>내부관리계획의 수립 및 시행</strong>: 개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다.
                        </li>
                        <li>
                           <strong>개인정보의 암호화</strong>: 이용자의 개인정보는 비밀번호는 암호화되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.
                        </li>
                        <li>
                           <strong>해킹 등에 대비한 기술적 대책</strong>: 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.
                        </li>
                        <li>
                           <strong>개인정보에 대한 접근 제한</strong>: 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여,변경,말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.
                        </li>
                        <li>
                           <strong>접속기록의 보관 및 위변조 방지</strong>: 개인정보처리시스템에 접속한 기록을 최소 6개월 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 보안기능 사용하고 있습니다.
                        </li>
                        <li>
                           <strong>문서보안을 위한 잠금장치 사용</strong>: 개인정보가 포함된 서류, 보조저장매체 등을 잠금장치가 있는 안전한 장소에 보관하고 있습니다.
                        </li>
                     </ul>

                     <h2>9. 개인정보 보호책임자</h2>
                     <p>협회는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>

                     <div className="bg-gray-50 p-4 rounded-lg">
                        <h3>개인정보 보호책임자</h3>
                        <ul className="list-none">
                           <li>
                              <strong>성명</strong>: 김수경
                           </li>
                           <li>
                              <strong>직책</strong>: 사무국장
                           </li>
                           <li>
                              <strong>연락처</strong>: 1566-3321, haan@hanallcompany
                           </li>
                        </ul>
                     </div>

                     <h2>10. 개인정보 처리방침 변경</h2>
                     <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>

                     <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                           <strong>시행일자:</strong> 2025년 1월 1일
                           <br />
                           <strong>개정일자:</strong> 2025년 1월 1일
                        </p>
                     </div>
                  </div>
               </Card>
            </div>
         </main>

         <Footer />
      </div>
   )
}
