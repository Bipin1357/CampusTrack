-- The frontend always uses a signed-in Supabase session for attendance.
-- Keep the table unavailable to anonymous visitors while allowing those sessions
-- to run the reads and writes used by the admin and student attendance pages.
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.attendance TO authenticated;

-- Keep the database constraint aligned with the three statuses supported by
-- the application. lower(status) also permits records created by an older,
-- cached client that still sends title-cased values.
ALTER TABLE public.attendance
  DROP CONSTRAINT IF EXISTS attendance_status_check;

ALTER TABLE public.attendance
  ADD CONSTRAINT attendance_status_check
  CHECK (lower(status) IN ('present', 'absent', 'late'));

-- Table grants alone do not permit writes when Row Level Security is enabled.
-- Administrators manage attendance for every student; students can only read
-- and mark their own records.
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'attendance'
      AND policyname = 'admins_manage_attendance'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY admins_manage_attendance
      ON public.attendance
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.users
          WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.users
          WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
      )
    $policy$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'attendance'
      AND policyname = 'students_read_own_attendance'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY students_read_own_attendance
      ON public.attendance
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.students
          WHERE students.id = attendance.student_id
            AND students.user_id = auth.uid()
        )
      )
    $policy$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'attendance'
      AND policyname = 'students_mark_own_attendance'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY students_mark_own_attendance
      ON public.attendance
      FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.students
          WHERE students.id = attendance.student_id
            AND students.user_id = auth.uid()
        )
      )
    $policy$;
  END IF;
END;
$$;
