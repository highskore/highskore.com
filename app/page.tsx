'use client'
import Juice from '@/ui/Juice'
import Spinner from '@/ui/Spinner'
import { useCallback, useState } from 'react'

export default function Home() {
  const [isJuiceLoaded, setIsJuiceLoaded] = useState(false)

  const handleJuiceLoaded = useCallback(() => {
    setTimeout(() => {
      setIsJuiceLoaded(true)
    }, 200)
  }, [])

  return (
    <div className='flex flex-col gap-16'>
      <Juice onLoaded={handleJuiceLoaded} />
      {isJuiceLoaded ? (
        <>
          <Header />
          <About />
          <Contact />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  )
}

function Header() {
  return (
    <div className='flex flex-row gap-4 h-screen' style={{ zIndex: 3 }}>
      <div className='flex flex-col'>
        <h1 className='text-primary'>highskore</h1>
        <p className='text-quaternary'>smart contract developer</p>
      </div>
    </div>
  )
}

function About() {
  return (
    <div className='flex flex-col gap-4' style={{ zIndex: 3 }}>
      <div className='text-secondary flex flex-col gap-4'>
        <p className='font-bold'>/me</p>
        <p>
          a software developer with a background in computer science and a
          foreground in aesthetics
        </p>
      </div>
    </div>
  )
}

function ContactLink({
  href,
  title,
  icon,
  website,
  email,
}: {
  email?: string
  href?: string
  icon?: any
  title: string
  website?: string
}) {
  return (
    <span className='block items-center gap-4'>
      {website && <p className='text-quaternary'>{website}</p>}
      {href && (
        <a
          className='text-secondary hover:text-primary transition-opacity duration-150'
          href={href}
          rel='noopener noreferrer'
          target='_blank'
        >
          {title}{' '}
          {icon ? (
            icon
          ) : (
            <svg
              className=' inline-block h-3 w-3'
              fill='none'
              stroke='currentColor'
              strokeWidth={1.5}
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
        </a>
      )}
      {email && (
        <p className='text-secondary hover:text-primary transition-opacity duration-150'>
          {title}
        </p>
      )}
    </span>
  )
}

function Contact() {
  return (
    <div className='flex flex-col gap-4 pb-8' style={{ zIndex: 3 }}>
      <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
        <ContactLink
          href='http://twitter.com/0xhighskore'
          title='0xhighskore'
          website='Twitter'
        />
        <ContactLink
          href='http://github.com/highskore'
          title='highskore'
          website='GitHub'
        />
        <ContactLink
          href='http://medium.com/@lu_ka_ra_ch_ki'
          title='lu_ka_ra_ch_ki'
          website='Medium'
        />
        <ContactLink
          href='mailto:dev@highskore.com'
          title='hi@highskore.com'
          website='Email'
        />
        <ContactLink
          href='https://hackmd.io/@highskore/HyLNOLeRkl'
          title='highskore'
          website='CV'
        />
        <ContactLink
          href='https://sikboi.tumblr.com'
          title='sikboi'
          website='Tumblr'
        />
      </div>
    </div>
  )
}
