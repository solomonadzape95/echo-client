import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdFingerprint, MdGavel, MdWarning, MdCheckCircle, MdCancel } from "react-icons/md";
import { Footer } from "../components/Footer";

export function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#102222] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#102222]/95 backdrop-blur-sm border-b border-[#234848]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdFingerprint className="w-6 h-6 text-[#13ecec]" />
              <h1 className="text-xl font-bold uppercase tracking-tight">echo</h1>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-[#92c9c9] hover:text-white transition-colors"
            >
              <MdArrowBack className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Title */}
          <div className="border-l-4 border-[#13ecec] pl-6">
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-2">
              Terms of Service
            </h1>
            <p className="text-[#92c9c9] text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <section className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
            <p className="text-[#92c9c9] leading-relaxed">
              Welcome to echo, a secure electronic voting platform. By accessing and using this platform, you agree 
              to be bound by these Terms of Service. Please read them carefully before using our services.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <MdCheckCircle className="w-6 h-6 text-[#13ecec]" />
              <h2 className="text-2xl font-bold uppercase tracking-tight">Acceptance of Terms</h2>
            </div>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <p className="text-[#92c9c9] leading-relaxed">
                By creating an account, logging in, or using any feature of the echo platform, you acknowledge that 
                you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. 
                If you do not agree to these terms, you must not use the platform.
              </p>
            </div>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Eligibility</h2>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg space-y-4">
              <p className="text-[#92c9c9] leading-relaxed">
                To use the echo platform, you must:
              </p>
              <ul className="list-disc list-inside text-[#92c9c9] space-y-2 ml-4">
                <li>Be eligible to vote according to the rules of the specific election</li>
                <li>Have a valid registration number recognized by the system</li>
                <li>Be at least the minimum age required for participation</li>
                <li>Provide accurate and truthful information during registration</li>
                <li>Maintain the security and confidentiality of your account credentials</li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <MdGavel className="w-6 h-6 text-[#13ecec]" />
              <h2 className="text-2xl font-bold uppercase tracking-tight">User Responsibilities</h2>
            </div>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg space-y-4">
              <p className="text-[#92c9c9] leading-relaxed">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-[#92c9c9] space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account password and credentials</li>
                <li>All activities that occur under your account</li>
                <li>Ensuring that your registration information is accurate and up-to-date</li>
                <li>Using the platform in compliance with all applicable laws and regulations</li>
                <li>Not attempting to manipulate, hack, or interfere with the voting process</li>
                <li>Not attempting to vote more than once in any election</li>
                <li>Not sharing your account with others or allowing unauthorized access</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <MdWarning className="w-6 h-6 text-[#13ecec]" />
              <h2 className="text-2xl font-bold uppercase tracking-tight">Prohibited Activities</h2>
            </div>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg space-y-4">
              <p className="text-[#92c9c9] leading-relaxed">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-[#92c9c9] space-y-2 ml-4">
                <li>Attempt to vote multiple times in the same election</li>
                <li>Use another person's account or registration number</li>
                <li>Attempt to reverse engineer, decompile, or hack the platform</li>
                <li>Introduce viruses, malware, or any harmful code</li>
                <li>Interfere with or disrupt the platform's security or functionality</li>
                <li>Attempt to access areas of the platform you are not authorized to access</li>
                <li>Manipulate election results or voting data</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
              </ul>
            </div>
          </section>

          {/* Voting Rules */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Voting Rules</h2>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg space-y-4">
              <ul className="list-disc list-inside text-[#92c9c9] space-y-2 ml-4">
                <li>Each eligible voter may cast only one vote per election</li>
                <li>Votes are final and cannot be changed once submitted</li>
                <li>Vote selections are anonymous and cannot be linked to your identity</li>
                <li>You must vote within the designated election period</li>
                <li>Votes submitted after the election deadline will not be counted</li>
                <li>You may verify that your vote was recorded, but you cannot see your specific selections after submission</li>
              </ul>
            </div>
          </section>

          {/* Account Termination */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <MdCancel className="w-6 h-6 text-[#13ecec]" />
              <h2 className="text-2xl font-bold uppercase tracking-tight">Account Termination</h2>
            </div>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <p className="text-[#92c9c9] leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account at any time if:
              </p>
              <ul className="list-disc list-inside text-[#92c9c9] space-y-2 ml-4">
                <li>You violate these Terms of Service</li>
                <li>You engage in fraudulent or illegal activities</li>
                <li>You attempt to manipulate the voting process</li>
                <li>You provide false or misleading information</li>
                <li>Your account is used in a manner that threatens the integrity of elections</li>
              </ul>
              <p className="text-[#92c9c9] leading-relaxed mt-4">
                Upon termination, you will lose access to the platform, but your voting records (if any) will be 
                retained in accordance with legal requirements and our Privacy Policy.
              </p>
            </div>
          </section>

          {/* Platform Availability */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Platform Availability</h2>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <p className="text-[#92c9c9] leading-relaxed">
                We strive to maintain the platform's availability, but we do not guarantee uninterrupted or error-free 
                service. The platform may be temporarily unavailable due to maintenance, technical issues, or circumstances 
                beyond our control. We are not liable for any losses or damages resulting from platform unavailability.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Limitation of Liability</h2>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <p className="text-[#92c9c9] leading-relaxed">
                To the maximum extent permitted by law, echo and its operators shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether 
                incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting 
                from your use of the platform.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Changes to Terms</h2>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <p className="text-[#92c9c9] leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. We will notify users of any material 
                changes by posting the updated terms on this page and updating the "Last updated" date. Your continued 
                use of the platform after such changes constitutes acceptance of the updated terms.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Governing Law</h2>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <p className="text-[#92c9c9] leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with applicable local laws. 
                Any disputes arising from these terms or your use of the platform shall be resolved through appropriate 
                legal channels.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Contact Information</h2>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <p className="text-[#92c9c9] leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="text-[#13ecec] space-y-2">
                <p>Email: support@echo-platform.local</p>
                <p>Platform: echo voting system</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

