import PatientForm from "@/components/PatientForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return(
    <>
    <div className="flex h-screen max-h-screen">
      {/* TODO: Add OTP verification | Passkey modal */}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
          src="/assets/icons/logo-full.svg"
          alt="CarePlus Logo"
          width={1000}
          height={1000}
          className="mb-12 h-10 w-fit"
          />
        </div>
        <PatientForm/>
        <div className="text-14-regular mt-20 flex justify-between">
          <p className="justify-items-end xl:text-left text-dark-600">© CarePulse Copyright</p>
          <Link href="/?admin=true" className="text-green-500">Admin</Link>
        </div>
      </section>
      <Image
      src="/assets/images/onboarding-img.png"
      alt="Onboarding Image"
      width={1000}
      height={1000}
      className="side-img w-[50%]"
      />
    </div>
    </>
  )
}
