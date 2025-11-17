export const METRIC_TYPES = {
  MARKETING: 'MARKETING',
  ADMIN: 'ADMIN'
} as const;

export const CURRICULUM_STATUSES = {
  PUBLISHED: 'PUBLISHED',
  SCHEDULED: 'SCHEDULED',
  REVIEW: 'REVIEW'
} as const;

export const PROJECT_STATUSES = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  COMPLETE: 'COMPLETE'
} as const;

export const PROJECT_COLUMNS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW'
} as const;

export const ATTENDANCE_STATUSES = {
  CHECK_IN: 'CHECK_IN',
  LATE: 'LATE',
  CHECK_OUT: 'CHECK_OUT'
} as const;

export const AUDIENCES = {
  GENERAL: 'GENERAL',
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
  COMMUNITY: 'COMMUNITY',
  MARKETING: 'MARKETING'
} as const;

export const NOTIFICATION_TYPES = {
  NOTICE: 'NOTICE',
  ASSIGNMENT: 'ASSIGNMENT',
  MESSAGE: 'MESSAGE'
} as const;

export type MetricType = (typeof METRIC_TYPES)[keyof typeof METRIC_TYPES];
export type CurriculumStatus = (typeof CURRICULUM_STATUSES)[keyof typeof CURRICULUM_STATUSES];
export type ProjectStatus = (typeof PROJECT_STATUSES)[keyof typeof PROJECT_STATUSES];
export type ProjectColumn = (typeof PROJECT_COLUMNS)[keyof typeof PROJECT_COLUMNS];
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[keyof typeof ATTENDANCE_STATUSES];
export type Audience = (typeof AUDIENCES)[keyof typeof AUDIENCES];
export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
