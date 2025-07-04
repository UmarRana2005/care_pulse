import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import RegisterForm from '@/components/RegisterForm';
import { getUser } from '@/lib/actions/patient.actions';
const Register = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params;
  const user = await getUser(userId);
  return (
    <div className='flex h-screen max-h-screen'>
        <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
          src="/assets/icons/logo-full.svg"
          alt="CarePlus Logo"
          width={1000}
          height={1000}
          className="mb-12 h-10 w-fit"
          />
        <RegisterForm user={user} />
        <p className="copyright py-12">© CarePulse Copyright</p>
      </div>
    </section>
    <Image
    src="/assets/images/register-img.png"
    alt="Onboarding Image"
    width={1000}
    height={1000}
    className="side-img max-w-[390px]"
      />
    </div>
  )
}

export default Register