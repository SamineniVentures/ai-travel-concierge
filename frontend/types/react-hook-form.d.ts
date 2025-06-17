import "react-hook-form"
import type { ZodType, ZodTypeDef } from "zod"
import type { FieldValues, UseFormProps, UseFormReturn, Resolver } from "react-hook-form"

declare module "react-hook-form" {
  export function useForm<
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues extends FieldValues | undefined = undefined,
    TSchema extends ZodType<any, ZodTypeDef, any> = ZodType<any, ZodTypeDef, any>,
  >(
    props: UseFormProps<TFieldValues, TContext> & {
      resolver: zodResolver<TSchema>
    },
  ): UseFormReturn<TFieldValues, TContext, TTransformedValues>
}

// If you are using @hookform/resolvers
declare module "@hookform/resolvers/zod" {
  export function zodResolver<
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues extends FieldValues | undefined = undefined,
    TSchema extends ZodType<any, ZodTypeDef, any> = ZodType<any, ZodTypeDef, any>,
  >(
    schema: TSchema,
    schemaOptions?: Parameters<typeof zodResolver>[1],
    resolverOptions?: Parameters<typeof zodResolver>[2],
  ): Resolver<TFieldValues, TContext>
}
