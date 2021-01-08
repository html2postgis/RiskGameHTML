using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RESTComponents.Helpers
{
    public class RandomCalculator
    {
		public List<List<int>> calculateWinner(int attack, int defence)
		{
			var rnd = new Random();
			var attackers = new List<int>();
			var defencors = new List<int>();
			
			for (int i = 0; i < attack; i++)
			{
				attackers.Add(-1);
			}
			for (int i = 0; i < defence; i++)
			{
				defencors.Add(-1);
			}
			while (attackers.Count !=0 && defencors.Count != 0)
			{
				// it will return attackers.Count if  attackers.Count < 3
				var partOfAttackers = attackers.Take(3).ToList();
				var partOfDefencors = defencors.Take(2).ToList();
				for (int i = 0; i < partOfAttackers.Count; i++)
				{
					partOfAttackers[i]= rnd.Next(1, 7);
					attackers.RemoveAt(0);
				}
				for (int i = 0; i < partOfDefencors.Count; i++)
				{
					partOfDefencors[i] = rnd.Next(1, 7);
					defencors.RemoveAt(0);
				}
				//list.RemoveRange(0, Math.Min(3, list.Count));
				partOfAttackers.Sort();
				partOfAttackers.Reverse();

				partOfDefencors.Sort();
				partOfDefencors.Reverse();

				var result = new List<int>();
				if (partOfAttackers.Count >= partOfDefencors.Count)
                {
					for (int k = 0; k < partOfAttackers.Count ; k++)
					{
						
						if (k>=partOfDefencors.Count)
                        {
							for (int j = 0; j < partOfAttackers.Count - partOfDefencors.Count; j++)
							{
								result.Add(1);
							}
						}
						else if (partOfAttackers[k] <= partOfDefencors[k])
							result.Add(0);
						else 
							result.Add(1);
					}
				}
				else if (partOfAttackers.Count < partOfDefencors.Count)
				{
					for (int i = 0; i < partOfDefencors.Count; i++)
					{
						
						
						if (i >= partOfAttackers.Count)
						{
							for (int j = 0; j < partOfDefencors.Count - partOfAttackers.Count ; j++)
							{
								result.Add(0);
							}
						}
						else if (partOfAttackers[i] <= partOfDefencors[i])
							result.Add(0);
						else
							result.Add(1);
					}


				}
				for (int i = 0; i < partOfAttackers.Count; i++)
				{
					if (result[i] == 0)
					{
						partOfAttackers.RemoveAt(i);
					}
				}
				for (int i = 0; i < partOfDefencors.Count; i++)
				{
					if (result[i] == 1)
					{
						partOfDefencors.RemoveAt(i);
					}
				}
				if (partOfAttackers.Count !=0)
					attackers.AddRange(partOfAttackers);
				if (partOfDefencors.Count != 0)
					defencors.AddRange(partOfDefencors);


			}
			var resultList = new List<List<int>>();
			resultList.Add(attackers);
			resultList.Add(defencors);
			return resultList;
		}
		public int[] generatePlayersTerritory ()
        {
			int[] arrA = new int[40];
			Random random = new Random();

			for (int i = 0; i <= arrA.Length - 1; i++)
			{
				var number = random.Next(1, 41);
				while (arrA.Any(n => n == number))
				{
					number = random.Next(1, 41);
				}

				arrA[i] = number;
				
			}
			return arrA;
		}
		public Dictionary<string,int> initialTroopsDeploy(int[] number_of_territories, int numOfTroops)
		{
		
			Random rnd = new Random();
			List<int> res = new List<int>();
			for (int i = 0; i < number_of_territories.Length; i++)
			{
				res.Add(number_of_territories[i]);
				Console.WriteLine(number_of_territories[i]);
			}
			for (int i = 0; i < numOfTroops; i++)
            {
				res.Add(number_of_territories[rnd.Next(1, number_of_territories.Length)]);
            }

			var g = res.GroupBy(i => i);
			var dic = new Dictionary<string, int>();
			foreach(var grp in g)
			{
				dic.Add(grp.Key.ToString(), grp.Count());
				 
			}
			return dic;

		}
	}
}
