import Link from 'next/link'
import Image from 'next/image'
import VideoCard from '@/components/marketing/VideoCard'
import { Icon, Eyebrow, H2, BTN_PRIMARY } from '@/components/marketing/ui'
import { SITE } from '@/lib/site'

const POINTS = [
  'Projector, whiteboard and an air-conditioned room',
  'A seat and writing desk for every learner',
  'The same class streamed live for online learners',
]

/**
 * Real photos and video of the Abuja classroom. Media lives in public/media
 * (prepared from the Video_Pictures folder).
 */
export default function TrainingSpace({ tone = 'tint' }) {
  return (
    <section id="space" className={`${tone === 'tint' ? 'bg-brand-50' : 'bg-white'} overflow-hidden px-5 py-20 text-ink sm:px-6 sm:py-24`}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Eyebrow>Where you learn</Eyebrow>
          <h2 className={H2}>A real classroom in {SITE.city}, and a seat online</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Rotech classes are taught face to face by an instructor, not left to pre-recorded videos. Come to the training room in {SITE.city} or follow the same session from wherever you are.
          </p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm font-medium">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Icon name="check" className="h-3 w-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <Link href="/contact" className={`mt-8 ${BTN_PRIMARY}`}>
            Arrange a visit
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          {/* Brand shapes behind the media */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-12 h-56 w-56 rounded-full bg-sun-400" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-brand-600" />

          <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 sm:items-center">
            <figure className="relative col-span-2 aspect-[4/3] overflow-hidden rounded-3xl shadow-xl shadow-brand-900/20 ring-4 ring-white sm:col-span-1 sm:aspect-[9/16]">
              <Image
                src="/media/classroom-1.jpg"
                alt={`Rotech training room in ${SITE.city} with rows of chairs with writing desks`}
                fill
                sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 90vw"
                className="object-cover"
              />
            </figure>
            <VideoCard
              className="sm:translate-y-8"
              src="/media/room-tour.mp4"
              poster="/media/room-tour-poster.jpg"
              title="Tour the classroom"
              duration="27 sec"
              alt="Classroom with projector screen, whiteboard and lectern"
            />
            <VideoCard
              src="/media/session.mp4"
              poster="/media/session-poster.jpg"
              title="Meet the founder"
              duration="1 min 21 sec"
              alt={`${SITE.founder.name}, ${SITE.founder.role.toLowerCase()} of ${SITE.name}, presenting from a lectern`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
