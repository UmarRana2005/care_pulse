import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import RegisterForm from '@/components/RegisterForm';
import { getUser } from '@/lib/actions/patient.actions';
const Register = async ({params:{userId}}:SearchParamProps) => {
    const user = await getUser(userId);
  return (
    <div className='flex h-screen max-h-screen'>
        <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
          src="/assets/icons/logo-full.svg"
          alt="CarePlus Logo"
          width={1000}
          height={1000}
          className="mb-12 h-10 w-fit"
          />
        <RegisterForm />
        <div className="text-14-regular mt-20 flex justify-between">
          <p className="justify-items-end xl:text-left text-dark-600">© CarePulse Copyright</p>
          <Link href="/?admin=true" className="text-green-500">Admin</Link>
        </div>
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