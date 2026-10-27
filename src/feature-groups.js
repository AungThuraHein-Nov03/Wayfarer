export const FEATURE_GROUPS=[['active','Active Features'],['passive','Passive Features'],['resource','Resources'],['uncategorized','Unsorted / Existing Features']];
export const featureGroup=row=>FEATURE_GROUPS.some(([id])=>id===row.category)?row.category:'uncategorized';
export const featuresInGroup=(c,group)=>(c.structured?.features||[]).filter(row=>featureGroup(row)===group);
export function setFeatureGroup(c,id,group){
 if(!FEATURE_GROUPS.some(([key])=>key===group))return false;
 const row=c.structured?.features?.find(item=>item.id===id);
 if(!row)return false;
 row.category=group;return true;
}
