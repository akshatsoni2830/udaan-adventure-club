import { prisma } from './prisma';

// Package CRUD operations
export const packageDb = {
  async getAll() {
    return await prisma.package.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async getById(id: number) {
    return await prisma.package.findUnique({
      where: { id }
    });
  },

  async create(data: {
    title: string;
    duration: string;
    departureCities: string;
    fixedDepartures: string;
    costDetails: string;
    inclusions: string;
    notes: string;
    itemsToCarry: string;
    paymentTerms: string;
    cancellationTerms: string;
    images: string;
  }) {
    return await prisma.package.create({ data });
  },

  async update(id: number, data: Partial<{
    title: string;
    duration: string;
    departureCities: string;
    fixedDepartures: string;
    costDetails: string;
    inclusions: string;
    notes: string;
    itemsToCarry: string;
    paymentTerms: string;
    cancellationTerms: string;
    images: string;
  }>) {
    return await prisma.package.update({
      where: { id },
      data
    });
  },

  async delete(id: number) {
    return await prisma.package.delete({
      where: { id }
    });
  }
};

// Destination CRUD operations
export const destinationDb = {
  async getAll() {
    return await prisma.destination.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async getById(id: number) {
    return await prisma.destination.findUnique({
      where: { id }
    });
  },

  async create(data: {
    title: string;
    description: string;
    images: string;
  }) {
    return await prisma.destination.create({ data });
  },

  async update(id: number, data: Partial<{
    title: string;
    description: string;
    images: string;
  }>) {
    return await prisma.destination.update({
      where: { id },
      data
    });
  },

  async delete(id: number) {
    return await prisma.destination.delete({
      where: { id }
    });
  }
};

// Enquiry CRUD operations
export const enquiryDb = {
  async getAll() {
    return await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async getById(id: number) {
    return await prisma.enquiry.findUnique({
      where: { id }
    });
  },

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) {
    return await prisma.enquiry.create({
      data: {
        ...data,
        status: 'new'
      }
    });
  },

  async updateStatus(id: number, status: 'new' | 'read' | 'resolved') {
    return await prisma.enquiry.update({
      where: { id },
      data: { status }
    });
  },

  async checkDuplicate(email: string, minutesAgo: number = 5) {
    const timeThreshold = new Date(Date.now() - minutesAgo * 60 * 1000);
    
    const existing = await prisma.enquiry.findFirst({
      where: {
        email,
        createdAt: {
          gte: timeThreshold
        }
      }
    });
    
    return existing !== null;
  }
};

// Admin user operations
export const adminDb = {
  async getByUsername(username: string) {
    return await prisma.adminUser.findUnique({
      where: { username }
    });
  },

  async create(data: {
    username: string;
    passwordHash: string;
  }) {
    return await prisma.adminUser.create({ data });
  }
};
