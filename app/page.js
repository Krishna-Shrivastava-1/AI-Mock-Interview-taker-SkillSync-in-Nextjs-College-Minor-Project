
import GradientText from "@/components/GradientText";
import Navbar from "@/components/Navbar";
import Prism from "@/components/Prism";
import SplitText from "@/components/SplitText";

import Image from "next/image";
import Spline from '@splinetool/react-spline/next';
import ScrollVelocity from "@/components/ScrollVelocity";
export default function Home() {
  return (
    <div>
      <div className="bg-black">
        <Navbar />

        <div className="flex items-center justify-center text-balance">


          <main className="relative w-full h-screen bg-gradient-to-b from-black via-gray-900 to-black">


            {/* Overlay your headline + CTA */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
              <div className="masky w-full flex items-center justify-center" style={{ width: '100%', height: '100vh', position: 'relative' }}>
                <Prism
                  animationType="3drotate"
                  timeScale={0.5}
                  height={3.5}
                  baseWidth={4.5}
                  scale={4.6}
                  hueShift={220}       // deep blue spectrum
                  colorFrequency={0.2} // subtle, darker shades
                  noise={0}
                  glow={0.5}
                />
                <div className="absolute top-[20%] w-full flex items-center justify-center">
                  <SplitText
                    text={"From practice to progress\n— only on Mokai."}
                    className="text-4xl sm:text-6xl font-semibold text-center shiny-text p-4 text-white whitespace-pre-line pb-4"
                    delay={100}
                    duration={0.2}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"

                  />
                </div>
                <div className="w-full  absolute bottom-0 h-[800px]  flex items-center justify-center">
                  <Spline scene="https://prod.spline.design/vmthtG9j3m8qKi0e/scene.splinecode" />

                </div>
              </div>

            </div>
          </main>
       


        </div>
        <ScrollVelocity
          texts={['Mock Test Community Rankings Resume Analysis Personalized Feedback Skill Progress Tracking']}
          velocity={100}
          className="custom-scroll-text text-sky-500 textshad"
        />
        <div>
         
          <section className="py-16 bg-black text-white">
  <h2 className="text-3xl font-bold text-center mb-12">Why Mokai?</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
    <div className="p-6 rounded-2xl bg-gray-900 shadow-lg text-center">
      <div className="text-4xl mb-4">🎤</div>
      <h3 className="text-xl font-semibold mb-2">Practice Without Pressure</h3>
      <p className="text-gray-400">
        Sharpen your skills with AI-driven mock interviews in a safe space.  
        No stress, no judgment — just a smarter way to prepare.
      </p>
    </div>
    <div className="p-6 rounded-2xl bg-gray-900 shadow-lg text-center">
      <div className="text-4xl mb-4">📊</div>
      <h3 className="text-xl font-semibold mb-2">Personalized Growth Insights</h3>
      <p className="text-gray-400">
        Get instant feedback on your answers, confidence, and communication.  
        Track your progress and see exactly where you need to improve.
      </p>
    </div>
    <div className="p-6 rounded-2xl bg-gray-900 shadow-lg text-center">
      <div className="text-4xl mb-4">🏆</div>
      <h3 className="text-xl font-semibold mb-2">Learn Together, Compete Better</h3>
      <p className="text-gray-400">
        Join a vibrant community of learners and job seekers.  
        Compare your performance, climb leaderboards, and stay motivated.
      </p>
    </div>
  </div>
</section>

        </div>
      </div>

    </div>
  );
}
