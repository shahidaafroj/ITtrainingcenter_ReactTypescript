// export * from './Iday';
// export * from './IResponse';
// export * from './IDepartment';
// export * from './IDesignation'; 
// export * from './ISlot';
// export * from './IVisitor';
// export * from './IOffer';
// export * from './IClassRoom';  
// export*from'./IBatch';
// export * from './ICourse';
// export * from './IEmployee';
// export * from './IInstructor';
// export * from './IRegistration';
// export * from './ICourseCombo';
// export * from './IAdmission';


// First export all independent interfaces
export * from './Iday';
export * from './IResponse';
export * from './IDepartment';
export * from './IDesignation';
export * from './ISlot';
export * from './IClassRoom';
// export * from './ICourse';

// Then export interfaces that depend on others
export * from './IVisitor';
export * from './IOffer';
// export * from './IBatch';
export * from './IEmployee';
// export * from './IInstructor';
// export * from './IRegistration';
export * from './ICourseCombo';
export * from './IAdmission';

// export * from './IMoneyReceipt';
export * from './IDailySalesRecord';
export * from './IBatch';
// export * from './ICourse';