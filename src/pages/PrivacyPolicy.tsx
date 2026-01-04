import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdFingerprint, MdLock, MdSecurity, MdVisibility, MdDataUsage } from "react-icons/md";
import { Footer } from "../components/Footer";

export function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="text-[#92c9c9] text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <section className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
            <p className="text-[#92c9c9] leading-relaxed">
              At echo, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              voting platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <MdDataUsage className="w-6 h-6 text-[#13ecec]" />
              <h2 className="text-2xl font-bold uppercase tracking-tight">Information We Collect</h2>
            </div>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#13ecec] mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-[#92c9c9] space-y-2 ml-4">
                  <li>Registration number (for identity verification)</li>
                  <li>Username and account credentials</li>
                  <li>Class/group affiliation</li>
                  <li>Profile picture (if provided)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#13ecec] mb-2">Voting Data</h3>
                <ul className="list-disc list-inside text-[#92c9c9] space-y-2 ml-4">
                  <li>Vote selections (anonymized and encrypted)</li>
                  <li>Vote timestamps</li>
                  <li>Election participation records</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#13ecec] mb-2">Technical Information</h3>
                <ul className="list-disc list-inside text-[#92c9c9] space-y-2 ml-4">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Session data and authentication tokens</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <MdVisibility className="w-6 h-6 text-[#13ecec]" />
              <h2 className="text-2xl font-bold uppercase tracking-tight">How We Use Your Information</h2>
            </div>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <ul className="list-disc list-inside text-[#92c9c9] space-y-2 ml-4">
                <li>To verify your identity and eligibility to vote</li>
                <li>To process and record your votes securely</li>
                <li>To maintain election integrity and prevent fraud</li>
                <li>To provide you with access to election results and your voting history</li>
                <li>To improve our platform and user experience</li>
                <li>To comply with legal obligations and election regulations</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <MdSecurity className="w-6 h-6 text-[#13ecec]" />
              <h2 className="text-2xl font-bold uppercase tracking-tight">Data Security</h2>
            </div>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg space-y-4">
              <p className="text-[#92c9c9] leading-relaxed">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-[#92c9c9] space-y-2 ml-4">
                <li>End-to-end encryption for all vote data</li>
                <li>Secure authentication using JWT tokens</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and role-based permissions</li>
                <li>Secure database storage with encryption at rest</li>
              </ul>
            </div>
          </section>

          {/* Vote Anonymity */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <MdLock className="w-6 h-6 text-[#13ecec]" />
              <h2 className="text-2xl font-bold uppercase tracking-tight">Vote Anonymity</h2>
            </div>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <p className="text-[#92c9c9] leading-relaxed mb-4">
                Your individual vote selections are kept completely anonymous. While we record that you have voted 
                (to prevent duplicate voting), your specific candidate choices are encrypted and cannot be linked 
                back to your identity. Only aggregated, anonymized results are made available.
              </p>
              <p className="text-[#92c9c9] leading-relaxed">
                This ensures the integrity of the democratic process while protecting your privacy.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Data Retention</h2>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <p className="text-[#92c9c9] leading-relaxed">
                We retain your personal information and voting records only for as long as necessary to fulfill 
                the purposes outlined in this policy, comply with legal obligations, and maintain election records 
                as required by law. Anonymized voting data may be retained for statistical and research purposes.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Your Rights</h2>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <p className="text-[#92c9c9] leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-[#92c9c9] space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account (subject to legal retention requirements)</li>
                <li>View your voting history and participation records</li>
                <li>File a complaint if you believe your privacy rights have been violated</li>
              </ul>
            </div>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Contact Us</h2>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <p className="text-[#92c9c9] leading-relaxed mb-4">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="text-[#13ecec] space-y-2">
                <p>Email: privacy@echo-platform.local</p>
                <p>Platform: echo voting system</p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Policy Updates</h2>
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
              <p className="text-[#92c9c9] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes 
                by posting the new policy on this page and updating the "Last updated" date. Your continued use of 
                the platform after such changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

