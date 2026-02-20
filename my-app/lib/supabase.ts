import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 客户端实例（用于浏览器）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 服务器端实例（用于API路由）
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export { supabaseUrl, supabaseAnonKey, serviceRoleKey };
