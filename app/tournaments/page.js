const { error } = await supabase
  .from("tournaments")
  .insert([
    {
      name: tournamentName,
      venue: venue,
      start_date: tournamentDate,
      date: tournamentDate
    }
  ]);

if (error) {
  alert("Error adding tournament: " + error.message);
} else {
  alert("Tournament added successfully!");
}
