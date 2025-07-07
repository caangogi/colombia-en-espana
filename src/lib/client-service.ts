import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import { 
  ClientRecord, 
  CreateClientData, 
  UpdateClientStripeData,
  ClientRecordSchema,
  COLLECTIONS
} from './firestore-schemas'

// Helper function to convert Firestore timestamps to dates
const convertTimestamps = (data: any) => {
  const converted = { ...data }
  for (const key in converted) {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate()
    }
  }
  return converted
}

// Helper function to generate unique IDs
const generateId = () => doc(collection(db, 'temp')).id

export class ClientService {
  private collectionName = COLLECTIONS.CLIENT_RECORDS

  // Create a new client record
  async createClient(clientData: CreateClientData): Promise<string> {
    try {
      console.log('🔍 Creating client with data:', JSON.stringify(clientData, null, 2))
      
      const clientId = generateId()
      const now = new Date()
      
      console.log('📝 Generated client ID:', clientId)
      
      const completeClientData = {
        ...clientData,
        id: clientId,
        metadata: {
          ...clientData.metadata,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          status: 'pending' as const,
          priority: 'normal' as const,
        }
      }

      console.log('📋 Complete client data before validation:', JSON.stringify(completeClientData, null, 2))

      // Validate the data
      console.log('🔍 Starting validation...')
      const validatedData = ClientRecordSchema.parse(completeClientData)
      console.log('✅ Validation successful')
      
      // Save to Firestore
      console.log('💾 Saving to Firestore...')
      await setDoc(doc(db, this.collectionName, clientId), {
        ...validatedData,
        metadata: {
          ...validatedData.metadata,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      })

      console.log('✅ Client created successfully with ID:', clientId)
      return clientId
    } catch (error) {
      console.error('❌ Error creating client:', error)
      console.error('❌ Error message:', error instanceof Error ? error.message : error)
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      throw new Error('Error al crear el registro del cliente')
    }
  }

  // Get client by ID
  async getClient(clientId: string): Promise<ClientRecord | null> {
    try {
      const clientDoc = await getDoc(doc(db, this.collectionName, clientId))
      
      if (!clientDoc.exists()) {
        return null
      }

      const data = convertTimestamps(clientDoc.data())
      return ClientRecordSchema.parse(data)
    } catch (error) {
      console.error('Error getting client:', error)
      throw new Error('Error al obtener el cliente')
    }
  }

  // Update client with Stripe data
  async updateClientStripeData(clientId: string, stripeData: UpdateClientStripeData): Promise<void> {
    try {
      const clientRef = doc(db, this.collectionName, clientId)
      
      await updateDoc(clientRef, {
        stripeData: stripeData.stripeData,
        'metadata.status': stripeData.metadata.status,
        'metadata.updatedAt': serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating client Stripe data:', error)
      throw new Error('Error al actualizar los datos de pago')
    }
  }

  // Update client status
  async updateClientStatus(clientId: string, status: 'pending' | 'processing' | 'completed' | 'cancelled'): Promise<void> {
    try {
      const clientRef = doc(db, this.collectionName, clientId)
      
      await updateDoc(clientRef, {
        'metadata.status': status,
        'metadata.updatedAt': serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating client status:', error)
      throw new Error('Error al actualizar el estado del cliente')
    }
  }

  // Get clients by email
  async getClientsByEmail(email: string): Promise<ClientRecord[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('personalInfo.email', '==', email),
        orderBy('metadata.createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return ClientRecordSchema.parse(data)
      })
    } catch (error) {
      console.error('Error getting clients by email:', error)
      throw new Error('Error al buscar clientes por email')
    }
  }

  // Get recent clients (for admin)
  async getRecentClients(limitCount: number = 50): Promise<ClientRecord[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('metadata.createdAt', 'desc'),
        limit(limitCount)
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return ClientRecordSchema.parse(data)
      })
    } catch (error) {
      console.error('Error getting recent clients:', error)
      throw new Error('Error al obtener clientes recientes')
    }
  }

  // Get clients by status
  async getClientsByStatus(status: 'pending' | 'processing' | 'completed' | 'cancelled'): Promise<ClientRecord[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('metadata.status', '==', status),
        orderBy('metadata.createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return ClientRecordSchema.parse(data)
      })
    } catch (error) {
      console.error('Error getting clients by status:', error)
      throw new Error('Error al obtener clientes por estado')
    }
  }

  // Get clients by service type
  async getClientsByServiceType(type: 'package' | 'service'): Promise<ClientRecord[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('serviceInfo.type', '==', type),
        orderBy('metadata.createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return ClientRecordSchema.parse(data)
      })
    } catch (error) {
      console.error('Error getting clients by service type:', error)
      throw new Error('Error al obtener clientes por tipo de servicio')
    }
  }

  // Search clients by name or email
  async searchClients(searchTerm: string): Promise<ClientRecord[]> {
    try {
      // Note: Firestore doesn't support full-text search out of the box
      // This is a simple implementation that searches by email prefix
      const q = query(
        collection(db, this.collectionName),
        where('personalInfo.email', '>=', searchTerm.toLowerCase()),
        where('personalInfo.email', '<=', searchTerm.toLowerCase() + '\uf8ff'),
        orderBy('personalInfo.email'),
        limit(20)
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return ClientRecordSchema.parse(data)
      })
    } catch (error) {
      console.error('Error searching clients:', error)
      throw new Error('Error al buscar clientes')
    }
  }

  // Update client priority
  async updateClientPriority(clientId: string, priority: 'low' | 'normal' | 'high' | 'urgent'): Promise<void> {
    try {
      const clientRef = doc(db, this.collectionName, clientId)
      
      await updateDoc(clientRef, {
        'metadata.priority': priority,
        'metadata.updatedAt': serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating client priority:', error)
      throw new Error('Error al actualizar la prioridad del cliente')
    }
  }

  // Assign agent to client
  async assignAgent(clientId: string, agentId: string): Promise<void> {
    try {
      const clientRef = doc(db, this.collectionName, clientId)
      
      await updateDoc(clientRef, {
        'metadata.assignedAgent': agentId,
        'metadata.updatedAt': serverTimestamp(),
      })
    } catch (error) {
      console.error('Error assigning agent:', error)
      throw new Error('Error al asignar agente')
    }
  }

  // Get clients assigned to agent
  async getClientsByAgent(agentId: string): Promise<ClientRecord[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('metadata.assignedAgent', '==', agentId),
        orderBy('metadata.createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = convertTimestamps(doc.data())
        return ClientRecordSchema.parse(data)
      })
    } catch (error) {
      console.error('Error getting clients by agent:', error)
      throw new Error('Error al obtener clientes por agente')
    }
  }

  // Get payment statistics
  async getPaymentStats(): Promise<{
    totalRevenue: number
    totalClients: number
    completedPayments: number
    pendingPayments: number
    packageSales: number
    serviceSales: number
  }> {
    try {
      // Get all clients
      const allClientsQuery = query(collection(db, this.collectionName))
      const allClientsSnapshot = await getDocs(allClientsQuery)
      
      let totalRevenue = 0
      let completedPayments = 0
      let pendingPayments = 0
      let packageSales = 0
      let serviceSales = 0
      
      allClientsSnapshot.docs.forEach(doc => {
        const client = doc.data() as ClientRecord
        
        if (client.stripeData?.paymentStatus === 'paid') {
          totalRevenue += client.stripeData.amountPaid
          completedPayments++
        } else {
          pendingPayments++
        }
        
        if (client.serviceInfo.type === 'package') {
          packageSales++
        } else {
          serviceSales++
        }
      })
      
      return {
        totalRevenue,
        totalClients: allClientsSnapshot.size,
        completedPayments,
        pendingPayments,
        packageSales,
        serviceSales
      }
    } catch (error) {
      console.error('Error getting payment stats:', error)
      throw new Error('Error al obtener estadísticas de pagos')
    }
  }
}

// Export singleton instance
export const clientService = new ClientService()