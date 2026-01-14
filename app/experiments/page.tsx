import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import { getAboutMe } from '@/lib/cosmic'
import ExperimentCard, { Experiment } from '@/components/ExperimentCard'

export const metadata: Metadata = {
  title: 'Experiments - Nicolas Ménard',
  description: 'Design experiments and explorations by Nicolas Ménard.',
}

const experiments: Experiment[] = [
  {
    slug: 'solana-transactions-pulse',
    title: 'Solana Transactions Pulse',
    description: 'A real-time visualization of Solana blockchain transactions',
    thumbnail: '/experiments/solana-transactions-pulse.png',
    tags: ['3D / WebGL', 'Generative', 'Blockchain'],
  },
  {
    slug: 'pixel-waves',
    title: 'Pixel Waves',
    description: 'An animated canvas of pixel waves',
    thumbnail: '/experiments/pixel-waves.png',
    tags: ['Pixel art', 'Animation'],
  },
]

export default async function ExperimentsPage() {
  const aboutMe = await getAboutMe().catch(() => null)

  return (
    <div className="min-h-screen">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navigation aboutMe={aboutMe} />
      <main id="main-content" role="main" className="pt-32 pb-16">
        <div className="container">
          <div className="mb-16" data-aos="fade-up">
            <h1 className="text-2xl md:text-3xl font-normal text-gray-900 leading-tight max-w-[960px]">
              I like building things just to see if I can—here are some experiments where I explore ideas and learn something new.
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8" role="list" aria-label="Experiments">
            {experiments.map((experiment) => (
              <div key={experiment.slug} role="listitem" data-aos="fade-up" data-aos-delay="50">
                <ExperimentCard experiment={experiment} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
