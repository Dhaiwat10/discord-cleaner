import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import type { Guild } from 'discord.js';

const leaveGuilds = async (guildIds: string[]) => {
  const res = await fetch('/api/leave-guilds', {
    method: 'POST',
    body: JSON.stringify({ guildIds }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
  console.log(res);
};

const Home: NextPage = () => {
  const { data, status } = useSession();
  const [guilds, setGuilds] = useState<Guild[]>([]);

  // the guilds that the user wants to leave
  const [selectedGuildIds, setSelectedGuildIds] = useState<string[]>([]);

  const onGuildSelect = (guildId: string) => {
    if (selectedGuildIds.includes(guildId)) {
      setSelectedGuildIds(selectedGuildIds.filter((id) => id !== guildId));
    } else {
      setSelectedGuildIds([...selectedGuildIds, guildId]);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/guilds')
        .then((res) => res.json())
        .then((data) => setGuilds(data.guilds));
    }
  }, [status]);

  return (
    <div>
      <h1>Discord cleaner</h1>
      <h4>Leave multiple discord servers at once</h4>
      {status === 'unauthenticated' && (
        <>
          {/* sign in button */}
          <a href='/api/auth/signin'>Sign in</a>
        </>
      )}

      {status === 'authenticated' && (
        <div>
          <h2>Logged in as {data.user?.name}</h2>
          <img src={data.user?.image as string} />

          {/* sign out button */}
          <a href='/api/auth/signout'>Sign out</a>

          <h2>Choose the servers you want to leave:</h2>

          {/* render a list of checkboxs and let them choose which servers they want to leave */}
          <ul>
            {guilds.map((guild) => (
              <li key={guild.id}>
                <input
                  type='checkbox'
                  value={guild.id}
                  checked={selectedGuildIds.includes(guild.id)}
                  onChange={(e) => onGuildSelect(e.target.value)}
                />
                {guild.name}
              </li>
            ))}
          </ul>

          <hr />

          <h3>Servers you have chosen to leave:</h3>
          {/* JSON.stringify show the list of selectedGuildIds */}
          <pre>{JSON.stringify(selectedGuildIds, null, 2)}</pre>

          <button
            onClick={() => leaveGuilds(selectedGuildIds)}
            disabled={selectedGuildIds.length === 0}
          >
            Leave selected servers
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
