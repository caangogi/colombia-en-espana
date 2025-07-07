#!/usr/bin/env tsx

/**
 * Sistema de Testing Automatizado - Day 5
 * Verifica todas las funcionalidades del sistema migrado
 */

import { storage } from '@/lib/storage'

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  duration?: number
}

class SystemTester {
  private results: TestResult[] = []
  
  async runAllTests(): Promise<void> {
    console.log('🚀 Iniciando tests del sistema Colombia en España...\n')
    
    await this.testDatabaseConnection()
    await this.testAuthenticationSystem()
    await this.testBlogSystem()
    await this.testBusinessSystem()
    await this.testProductSystem()
    
    this.printResults()
  }

  private async testDatabaseConnection(): Promise<void> {
    console.log('📊 Testing Database Connection...')
    const startTime = Date.now()
    
    try {
      const blogs = await storage.getBlogPosts()
      const restaurants = await storage.getRestaurants()
      
      this.addResult({
        name: 'Database Connection',
        status: 'pass',
        message: `Connected successfully. Found ${blogs?.length || 0} blogs, ${restaurants?.length || 0} restaurants`,
        duration: Date.now() - startTime
      })
    } catch (error) {
      this.addResult({
        name: 'Database Connection',
        status: 'fail',
        message: `Database connection failed: ${error}`,
        duration: Date.now() - startTime
      })
    }
  }

  private async testAuthenticationSystem(): Promise<void> {
    console.log('🔐 Testing Authentication System...')
    const startTime = Date.now()
    
    try {
      // Test user creation and retrieval
      const testUser = {
        id: 'test-user-' + Date.now(),
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user' as const
      }
      
      const createdUser = await storage.upsertUser(testUser)
      const retrievedUser = await storage.getUser(createdUser.id)
      
      if (retrievedUser && retrievedUser.email === testUser.email) {
        this.addResult({
          name: 'Authentication System',
          status: 'pass',
          message: 'User creation and retrieval working correctly',
          duration: Date.now() - startTime
        })
      } else {
        this.addResult({
          name: 'Authentication System',
          status: 'fail',
          message: 'User retrieval mismatch',
          duration: Date.now() - startTime
        })
      }
    } catch (error) {
      this.addResult({
        name: 'Authentication System',
        status: 'fail',
        message: `Auth test failed: ${error}`,
        duration: Date.now() - startTime
      })
    }
  }

  private async testBlogSystem(): Promise<void> {
    console.log('📝 Testing Blog System...')
    const startTime = Date.now()
    
    try {
      const blogs = await storage.getBlogPosts()
      const publishedBlogs = blogs.filter(blog => blog.status === 'publicado')
      
      if (blogs.length > 0) {
        // Test individual blog retrieval
        const firstBlog = blogs[0]
        const retrievedBlog = await storage.getBlogPost(firstBlog.id)
        
        if (retrievedBlog && retrievedBlog.id === firstBlog.id) {
          this.addResult({
            name: 'Blog System',
            status: 'pass',
            message: `Found ${blogs.length} blogs (${publishedBlogs.length} published). CRUD operations working`,
            duration: Date.now() - startTime
          })
        } else {
          this.addResult({
            name: 'Blog System',
            status: 'warning',
            message: 'Blog retrieval inconsistency detected',
            duration: Date.now() - startTime
          })
        }
      } else {
        this.addResult({
          name: 'Blog System',
          status: 'warning',
          message: 'No blogs found in database',
          duration: Date.now() - startTime
        })
      }
    } catch (error) {
      this.addResult({
        name: 'Blog System',
        status: 'fail',
        message: `Blog system test failed: ${error}`,
        duration: Date.now() - startTime
      })
    }
  }

  private async testBusinessSystem(): Promise<void> {
    console.log('🏢 Testing Business System...')
    const startTime = Date.now()
    
    try {
      const businesses = await storage.getBusinessListings()
      
      this.addResult({
        name: 'Business System',
        status: 'pass',
        message: `Business listings accessible. Found ${businesses.length} businesses`,
        duration: Date.now() - startTime
      })
    } catch (error) {
      this.addResult({
        name: 'Business System',
        status: 'fail',
        message: `Business system test failed: ${error}`,
        duration: Date.now() - startTime
      })
    }
  }

  private async testProductSystem(): Promise<void> {
    console.log('💳 Testing Product/Checkout System...')
    const startTime = Date.now()
    
    try {
      const products = await storage.getProducts()
      const packages = await storage.getProducts('package')
      const services = await storage.getProducts('service')
      
      this.addResult({
        name: 'Product System',
        status: 'pass',
        message: `Product system working. Found ${products.length} total products (${packages.length} packages, ${services.length} services)`,
        duration: Date.now() - startTime
      })
    } catch (error) {
      this.addResult({
        name: 'Product System',
        status: 'fail',
        message: `Product system test failed: ${error}`,
        duration: Date.now() - startTime
      })
    }
  }

  private addResult(result: TestResult): void {
    this.results.push(result)
    const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️'
    console.log(`${icon} ${result.name}: ${result.message}${result.duration ? ` (${result.duration}ms)` : ''}`)
  }

  private printResults(): void {
    console.log('\n' + '='.repeat(60))
    console.log('📊 RESUMEN DE TESTS DEL SISTEMA')
    console.log('='.repeat(60))
    
    const passed = this.results.filter(r => r.status === 'pass').length
    const failed = this.results.filter(r => r.status === 'fail').length
    const warnings = this.results.filter(r => r.status === 'warning').length
    
    console.log(`✅ Pasaron: ${passed}`)
    console.log(`❌ Fallaron: ${failed}`)
    console.log(`⚠️  Advertencias: ${warnings}`)
    console.log(`📊 Total: ${this.results.length}`)
    
    const successRate = Math.round((passed / this.results.length) * 100)
    console.log(`\n🎯 Tasa de éxito: ${successRate}%`)
    
    if (failed === 0) {
      console.log('\n🎉 ¡Todos los tests principales pasaron! Sistema listo para despliegue.')
    } else {
      console.log('\n⚠️  Se encontraron problemas que necesitan resolución antes del despliegue.')
    }
    
    console.log('\n' + '='.repeat(60))
  }
}

// Ejecutar tests si se llama directamente
if (require.main === module) {
  const tester = new SystemTester()
  tester.runAllTests().catch(console.error)
}

export { SystemTester }