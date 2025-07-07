'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { CreateClientSchema, SERVICE_CONFIG, PackageId, ServiceId } from '@/lib/firestore-schemas'
import { User, Phone, Mail, MapPin, FileText, CreditCard, ArrowRight, Calendar, Globe } from 'lucide-react'

// Form validation schema
const ClientFormSchema = CreateClientSchema.extend({
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones'
  }),
  acceptPrivacy: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar la política de privacidad'
  })
})

type ClientFormData = z.infer<typeof ClientFormSchema>

interface ClientDataFormProps {
  type: 'package' | 'service'
  itemId: PackageId | ServiceId
  onComplete: (clientId: string, clientData: any) => void
  onCancel?: () => void
}

export default function ClientDataForm({ type, itemId, onComplete, onCancel }: ClientDataFormProps) {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const { toast } = useToast()

  // Get item information
  const itemInfo = type === 'package' 
    ? SERVICE_CONFIG.packages[itemId as PackageId]
    : SERVICE_CONFIG.services[itemId as ServiceId]

  const form = useForm<ClientFormData>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        documentType: 'passport',
        documentNumber: '',
        nationality: 'Colombia',
        birthDate: '',
      },
      contactInfo: {
        address: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Colombia',
        preferredContactMethod: 'email',
        whatsappNumber: '',
      },
      serviceInfo: {
        type,
        [type === 'package' ? 'packageId' : 'serviceId']: itemId,
        serviceName: itemInfo.name,
        serviceDescription: itemInfo.description,
        price: itemInfo.price,
        currency: 'EUR',
        urgency: 'normal',
        additionalNotes: '',
      },
      migrationInfo: {
        currentCountry: 'Colombia',
        plannedArrivalDate: '',
        migrationPurpose: 'work',
        hasEUCitizenship: false,
        previousSpainVisits: false,
        spokenLanguages: ['Español'],
      },
      acceptTerms: false,
      acceptPrivacy: false,
    }
  })

  const onSubmit = async (data: ClientFormData) => {
    console.log('🚀 Form submit triggered with data:', data)
    setLoading(true)
    
    try {
      // Log form errors
      console.log('🔍 Form errors:', form.formState.errors)
      
      // Check if we're on the final step (step 3)
      if (currentStep !== 3) {
        console.log('⚠️ Form submitted but not on final step, moving to next step')
        nextStep()
        return
      }
      
      // Validate acceptance fields
      if (!data.acceptTerms) {
        toast({
          title: "Error de validación",
          description: "Debes aceptar los términos y condiciones",
          variant: "destructive"
        })
        setLoading(false)
        return
      }
      
      if (!data.acceptPrivacy) {
        toast({
          title: "Error de validación",
          description: "Debes aceptar la política de privacidad",
          variant: "destructive"
        })
        setLoading(false)
        return
      }
      
      // Remove form-specific fields
      const { acceptTerms, acceptPrivacy, ...clientData } = data
      
      // Clean birth date if empty
      if (clientData.personalInfo.birthDate === '') {
        clientData.personalInfo.birthDate = '1990-01-01' // Default date for now
      }
      
      console.log('📤 Preparing client data:', clientData)
      
      // Add metadata
      const completeClientData = {
        ...clientData,
        metadata: {
          source: 'web' as const,
          ipAddress: '', // This would be filled server-side
          userAgent: navigator.userAgent,
          referralSource: document.referrer || '',
        }
      }

      console.log('✅ Proceeding to payment with client data')
      
      // Call onComplete directly without creating the client record yet
      // The payment wrapper will handle creating the client record after successful payment
      onComplete('temp_client_id', completeClientData)
      
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    const fieldsToValidate = currentStep === 1 
      ? ['personalInfo.firstName', 'personalInfo.lastName', 'personalInfo.email', 'personalInfo.phone']
      : ['contactInfo.address', 'contactInfo.city', 'contactInfo.province']
    
    form.trigger(fieldsToValidate as any).then(isValid => {
      if (isValid) {
        setCurrentStep(currentStep + 1)
      }
    })
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Datos Personales</span>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400" />
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Contacto</span>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400" />
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Confirmación</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>{itemInfo.name}</span>
            <Badge variant="secondary">{itemInfo.price}€</Badge>
          </CardTitle>
          <CardDescription>
            {itemInfo.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Información Personal</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="personalInfo.firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre *</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="personalInfo.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellidos *</FormLabel>
                          <FormControl>
                            <Input placeholder="Tus apellidos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="personalInfo.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="tu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="personalInfo.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono *</FormLabel>
                          <FormControl>
                            <Input placeholder="+57 300 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="personalInfo.documentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Documento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="passport">Pasaporte</SelectItem>
                              <SelectItem value="cedula">Cédula</SelectItem>
                              <SelectItem value="nie">NIE</SelectItem>
                              <SelectItem value="dni">DNI</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="personalInfo.documentNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Documento</FormLabel>
                          <FormControl>
                            <Input placeholder="123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="personalInfo.nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nacionalidad</FormLabel>
                          <FormControl>
                            <Input placeholder="Colombia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="personalInfo.birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Nacimiento</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={nextStep}>
                      Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Información de Contacto</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactInfo.address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Dirección Completa *</FormLabel>
                          <FormControl>
                            <Input placeholder="Calle, número, barrio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactInfo.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad *</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu ciudad" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactInfo.province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provincia/Estado *</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu provincia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactInfo.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código Postal</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactInfo.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>País</FormLabel>
                          <FormControl>
                            <Input placeholder="Colombia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactInfo.preferredContactMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Método de Contacto Preferido</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Teléfono</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactInfo.whatsappNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+57 300 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Anterior
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Migration Info & Confirmation */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Información Migratoria</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="migrationInfo.plannedArrivalDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha Planificada de Llegada</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="migrationInfo.migrationPurpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Propósito de la Migración</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="work">Trabajo</SelectItem>
                              <SelectItem value="study">Estudios</SelectItem>
                              <SelectItem value="family">Familia</SelectItem>
                              <SelectItem value="business">Negocios</SelectItem>
                              <SelectItem value="other">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="migrationInfo.hasEUCitizenship"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              ¿Tienes ciudadanía europea?
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="migrationInfo.previousSpainVisits"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              ¿Has visitado España antes?
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="serviceInfo.additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas Adicionales</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Comparte cualquier información adicional que consideres relevante..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Terms and conditions */}
                  <div className="space-y-4 border-t pt-4">
                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Acepto los{' '}
                              <a href="/terminos" className="text-blue-600 hover:underline">
                                términos y condiciones
                              </a>
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="acceptPrivacy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Acepto la{' '}
                              <a href="/privacidad" className="text-blue-600 hover:underline">
                                política de privacidad
                              </a>
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Anterior
                    </Button>
                    <div className="space-x-2">
                      {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                          Cancelar
                        </Button>
                      )}
                      <Button 
                        type="submit" 
                        disabled={loading}
                      >
                        {loading ? (
                          'Procesando...'
                        ) : (
                          <>
                            Continuar al Pago <CreditCard className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}