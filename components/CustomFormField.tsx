import React from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Control } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { InputType } from './PatientForm'
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput , { type Value } from 'react-phone-number-input'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'

interface CustomFormFieldProps {
  inputType: InputType,  
  control: Control<any>,
  name: string,
  placeholder?: string,
  label?: string,
  icon_src?: string,
  icon_alt?: string,
  disabled?: boolean,
  dateFormat?: string,
  showTimeSelect?: boolean,
  children?: React.ReactNode,
  renderSkeleton?: (field:any) => React.ReactNode
}

const isValidImageSrc = (src: unknown): src is string => {
  return typeof src === "string" && src.trim().startsWith("/");
};

const RenderField = ({ field, props }: { field: any, props: CustomFormFieldProps }) => {
  const { inputType, placeholder, disabled, icon_src, icon_alt, dateFormat, showTimeSelect, renderSkeleton } = props;

  switch (inputType) {
    case InputType.INPUT:
      return (
        <div className='rounded-md flex bg-dark-400 border border-dark-500'>
          {isValidImageSrc(icon_src) && (
            <Image
              src={icon_src}
              onError={(e) => e.currentTarget.src = "/assets/icons/fallback.svg"}
              alt={icon_alt || "Field Icon"}
              height={24}
              width={24}
              className="ml-2"
            />
          )}

          <FormControl>
            <Input {...field} placeholder={placeholder} className='shad-input border-0' disabled={disabled} />
          </FormControl>
        </div>
      );

    case InputType.TEL:
      return (
        <PhoneInput
          placeholder={placeholder}
          defaultCountry='US'
          international
          withCountryCallingCode
          value={field.value as Value | undefined}
          onChange={field.onChange}
          className='input-phone'
        />
      );
      case InputType.DATE_PICKER:
      return (
        <div className='flex rounded-md border border-dark-500 bg-dark-400'>
          <Image
          src="/assets/icons/calendar.svg"
          alt="Calendar Icon"
          height={24}
          width={24}
          className="ml-2"
          />
          <FormControl>
            <DatePicker selected={field.value} onChange={(date) => field.onChange(date)} 
              showTimeSelect={showTimeSelect ?? false}
              dateFormat={dateFormat ?? 'MM/dd/yyyy'}
              timeInputLabel='Time:'
              wrapperClassName='date-picker'
        
              />
          </FormControl>
        </div>
      )
      case InputType.Skeleton:
        return renderSkeleton ? renderSkeleton(field) : null;
        case InputType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className='shad-select-trigger'>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className='shad-select-content'>
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      )
      case InputType.TEXTAREA:
        return(
          <FormControl>
            <Textarea
            placeholder={placeholder}
            {...field}
            className='shad-textArea'
            disabled={props.disabled}
            />
          </FormControl>
        )
        case InputType.CHECKBOX:
          return (<FormControl>
            <div className='flex items-center gap-4'>
              <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              />
              <label htmlFor={props.name} className='checkbox-label'>
                {props.label}
              </label>
            </div>
          </FormControl>)
    default:
      return null;
  }
};

const CustomFormField = (props:CustomFormFieldProps) => {
  const {control,name,placeholder,label,inputType, icon_src, icon_alt, disabled, dateFormat, showTimeSelect, children} = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
            {inputType !== InputType.CHECKBOX && label && (
          <FormLabel>{label}</FormLabel>
            )}
          <RenderField field={field} props={props}/>
          <FormMessage className='shad-error'/>
        </FormItem>
      )}  
      />
    )
}
export default CustomFormField