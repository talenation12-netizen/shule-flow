type Job = {
  name: string;
  data: any;
};

const jobs: Job[] = [];

export const reconciliationQueue = {
  async add(name: string, data: any) {
    jobs.push({ name, data });

    // simulate async worker trigger
    setTimeout(() => {
      console.log("⚡ processing job:", data);
    }, 100);

    return { id: Date.now().toString() };
  },
};