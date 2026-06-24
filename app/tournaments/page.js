const { error } = await supabase
  .from("tournaments")
  .insert([
    {
      name: tournamentName,
      venue: venue,
      start_date: tournamentDate,
      end_date: tournamentDate
    }
  ]);
