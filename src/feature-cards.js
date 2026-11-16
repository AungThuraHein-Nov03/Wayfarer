import {COLLECTIONS} from './structured.js';
import {FEATURE_GROUPS,featureGroup} from './feature-groups.js';

const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const hasContent=value=>String(value??'').trim().length>0;
export const featureTitle=(row,key)=>String(row.name??'').trim()||`Unnamed ${key==='feats'?'feat':'feature'}`;
export const featureMeta=(row,key)=>key==='feats'?String(row.source??''):[row.uses,row.recharge].filter(hasContent).join(' · ');

export function renderFeatureReadView(key,row){
 const category=key==='features'?FEATURE_GROUPS.find(([id])=>id===featureGroup(row))?.[1]:'';
 const details=key==='features'?[['Uses / Charges',row.uses],['Recharge',row.recharge]]:[['Source / Level',row.source]];
 const fields=[...(category?[['Category',category]]:[]),...details].filter(([,value])=>hasContent(value));
 const facts=fields.length?`<dl class="feature-readonly-facts">${fields.map(([label,value])=>`<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('')}</dl>`:'';
 const description=hasContent(row.notes)?escapeHTML(row.notes):'<em class="feature-description-empty">No description recorded yet. Use Edit to add details.</em>';
 return `<div class="feature-display-toolbar"><button type="button" class="feature-edit-button" data-action="edit-feature" title="Edit ${escapeHTML(featureTitle(row,key))}" aria-label="Edit ${escapeHTML(featureTitle(row,key))}"><svg class="feature-pencil-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button></div>
 ${facts}
 <div class="feature-readonly-description"><div class="feature-readonly-heading">Description</div><p>${description}</p></div>`;
}

export function renderFeatureCard(key,row,{group=null}={}){
 const id=escapeHTML(row.id);
 const category=group===null?'':`<label>Category<select data-feature-group="${id}">${FEATURE_GROUPS.map(([value,label])=>`<option value="${value}" ${featureGroup(row)===value?'selected':''}>${escapeHTML(label)}</option>`).join('')}</select></label>`;
 const fields=COLLECTIONS[key].fields.map(([field,label])=>`<label>${escapeHTML(label)}${field==='notes'?`<textarea data-row-section="${key}" data-row-id="${id}" data-row-field="${field}" rows="5">${escapeHTML(row[field])}</textarea>`:`<input data-row-section="${key}" data-row-id="${id}" data-row-field="${field}" value="${escapeHTML(row[field])}"/>`}</label>`).join('');
 return `<details class="feature-card" data-feature-id="${id}" data-feature-kind="${key}">
   <summary><span class="feature-card-name">${escapeHTML(featureTitle(row,key))}</span><span class="feature-card-meta">${escapeHTML(featureMeta(row,key))}</span><span class="feature-card-chevron" aria-hidden="true">⌄</span></summary>
   <div class="feature-readonly" data-feature-view>${renderFeatureReadView(key,row)}</div>
   <div class="feature-edit-panel" data-feature-editor hidden>
     <div class="structured-fields">${category}${fields}</div>
     <div class="feature-editor-actions"><button type="button" class="primary" data-action="done-feature">Done editing</button><button type="button" class="danger remove-row" data-action="remove-row" data-section="${key}" data-id="${id}">Remove</button></div>
   </div>
 </details>`;
}
