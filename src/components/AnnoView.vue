<template>
    <div class="container">
        <div class="row mt-2">
            <div class="col">
                <h1>RedHot Annotation Viewer</h1>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col">
                <input type="file" ref="doc" @change="readfile()"/>
            </div>
            <div class="col">
                <button class="btn btn-light" @click="dec_findex()">
                    <i class="bi bi-chevron-left"></i>
                </button>
            </div>
            <div class="col">
                <h4>{{ findex+1 }} / {{ parsed_file.length }}</h4>
            </div>
            <div class="col">
                <button class="btn btn-light" @click="inc_findex()">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
            <div class="col">

            </div>
        </div>

        <div class="row mt-3">
            <div class="col">
                <div class="card" style="background-color:#ffe4e3;">
                    <div class="card-header text-muted">
                        RedHot Post
                    </div>
                    <div class="card-body">
                        <span style="white-space: pre-line;" v-html="printPost" ref="cardNode">
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Retrieved Abstracts</h5>
                        <ul class="nav nav-tabs">
                            <li class="nav-item" v-for="tab in tabs">
                                <a class="nav-link" @click="setActive(tab)" :class="{ active: tab.isActive }">{{ tab.label }}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body tab-content">
                        <div v-for="tab in tabs" v-show="tab.isActive">
                            <div class="row">
                            <div class="col">
                                <h5><strong>{{ tab.title }}</strong></h5>
                                <p v-html="printAbs">

                                </p>
                            </div>
                            <div class="col-4 border-left">
                                <h5>Annotations:</h5>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item" v-for="anno in tab.annot">
                                        {{ anno.label }}: &nbsp;    
                                        <button class="btn btn-sm" :class="[anno.aclass]">
                                            {{ anno.anno }}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import $ from 'jquery'
    export default {
        data() {
            return {
                file: null,
                parsed_file: [], 
                redhot_post: "",
                tabs: [],
                findex: -1,
            }
        },
        methods: {
            readfile() {
                this.redhot_post = "";
                this.tabs = [];
                this.file = this.$refs.doc.files[0];
                const reader = new FileReader();
                if(this.file.name.includes('.json')) {
                    reader.onload = (res) => {
                        this.parsed_file = JSON.parse(res.target.result);
                        this.findex = 0;
                        this.load_file();
                    }
                    reader.onerror = (err) => console.log(err);
                    reader.readAsText(this.file);
                }
            },
            inc_findex() {
                if (this.findex < this.parsed_file.length - 1) {
                    this.findex++;
                    this.load_file();
                }
            },
            dec_findex() {
                if (this.findex > 0) {
                    this.findex--;
                    this.load_file();
                }
            },
            load_file() {
                this.redhot_post = this.parsed_file[this.findex].text;
                let end_label = '</span>';
                const stage_2 = JSON.parse(this.parsed_file[this.findex].stage2_labels)[0]['crowd-entity-annotation']['entities'];
                let stage_2_tag = '<span class="high highBlue"><div class="hovbox">replace</div>';
                console.log(Object.keys(this.parsed_file[this.findex]));
                if (Object.keys(this.parsed_file[this.findex]).includes("stage1_labels")) {
                    const stage_1 = JSON.parse(this.parsed_file[this.findex].stage1_labels)[0]['crowd-entity-annotation']['entities'];
                    let stage_1_tag = '<span class="high highYellow" ><div class="hovbox">replace</div>';
                    for (let i = 0; i < stage_1.length; i++) {
                        //wrap span with span
                        let start = stage_1[i].startOffset;
                        let end = stage_1[i].endOffset;
                        let label = stage_1[i].label;
                        console.log(label);

                        console.log(stage_1);
                        console.log(this.redhot_post.slice(start, end));

                        console.log(label);
                        let stage_1_tag_mod = stage_1_tag.replace('replace', label);
                        console.log(end_label);

                        let comp_claim = "";
                        
                        console.log(Object.keys(this.parsed_file));

                        if (Object.keys(this.parsed_file[this.findex]).includes('claim_x')) {
                            comp_claim = this.parsed_file[this.findex].claim_x.trim();
                        } else {
                            comp_claim = this.parsed_file[this.findex].claim.trim();
                        }

                        const levenshteinDistance = (s, t) => {
                            if (!s.length) return t.length;
                            if (!t.length) return s.length;
                            const arr = [];
                            for (let i = 0; i <= t.length; i++) {
                                arr[i] = [i];
                                for (let j = 1; j <= s.length; j++) {
                                arr[i][j] =
                                    i === 0
                                    ? j
                                    : Math.min(
                                        arr[i - 1][j] + 1,
                                        arr[i][j - 1] + 1,
                                        arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                                        );
                                }
                            }
                            return arr[t.length][s.length];
                        };  

                        if (levenshteinDistance(this.redhot_post.slice(start, end).trim(), comp_claim) < 5) {
                            stage_1_tag_mod = stage_1_tag_mod.replace('highYellow', 'highdYellow');
                            stage_1_tag_mod = stage_1_tag_mod.replace(label, label + " (target)");
                        }

                        console.log("ANALYZE");
                        console.log(this.redhot_post.slice(start, end));
                        console.log(this.parsed_file[this.findex].claim);

                        this.redhot_post = this.redhot_post.slice(0, start) 
                                            + stage_1_tag_mod 
                                            + this.redhot_post.slice(start, end)
                                            + end_label
                                            + this.redhot_post.slice(end);
                        for (let j = i + 1; j < stage_1.length; j++) {
                            let j_start = stage_1[j].startOffset;
                            let j_end = stage_1[j].endOffset;
                            const get_update_func = (val, start, end, startLen, endLen) => {
                                if (val >= start && val <= end) return val + startLen;
                                else if (val >= start) return val + startLen + endLen;
                                else return val;
                            }
                            stage_1[j].startOffset = get_update_func(j_start, start, end, stage_1_tag_mod.length, end_label.length);
                            stage_1[j].endOffset = get_update_func(j_end, start, end, stage_1_tag_mod.length, end_label.length)
                        }
                        for (let j = 0; j < stage_2.length; j++) {
                            let j_start = stage_2[j].startOffset;
                            let j_end = stage_2[j].endOffset;
                            const get_update_func = (val, start, end, startLen, endLen) => {
                                if (val >= start && val <= end) return val + startLen;
                                else if (val >= start) return val + startLen + endLen;
                                else return val;
                            }
                            stage_2[j].startOffset = get_update_func(j_start, start, end, stage_1_tag_mod.length, end_label.length);
                            stage_2[j].endOffset = get_update_func(j_end, start, end, stage_1_tag_mod.length, end_label.length)
                        }
                    }
                } else {
                    let stage_1_tag = '<span class="high highdYellow"><div class="hovbox">Claim (target)</div>';
                    let comp_claim = this.parsed_file[this.findex].claim.trim();
                    let start = this.redhot_post.indexOf(comp_claim);
                    if (start != -1) {
                        let end = start + comp_claim.length;
                        this.redhot_post = this.redhot_post.slice(0, start) 
                                            + stage_1_tag 
                                            + this.redhot_post.slice(start, end)
                                            + end_label
                                            + this.redhot_post.slice(end);
                        for (let j = 0; j < stage_2.length; j++) {
                            let j_start = stage_2[j].startOffset;
                            let j_end = stage_2[j].endOffset;
                            const get_update_func = (val, start, end, startLen, endLen) => {
                                if (val >= start && val <= end) return val + startLen;
                                else if (val >= start) return val + startLen + endLen;
                                else return val;
                            }
                            stage_2[j].startOffset = get_update_func(j_start, start, end, stage_1_tag.length, end_label.length);
                            stage_2[j].endOffset = get_update_func(j_end, start, end, stage_1_tag.length, end_label.length)
                        }
                    }
                }   
                for (let i = 0; i < stage_2.length; i++) {
                    //wrap span with span
                    let start = stage_2[i].startOffset;
                    let end = stage_2[i].endOffset;
                    let label = stage_2[i].label;

                    //console.log(stage_1);
                    //console.log(this.redhot_post.slice(start, end));

                    let stage_2_tag_mod = stage_2_tag.replace('replace', label);
                    console.log(end_label);

                    this.redhot_post = this.redhot_post.slice(0, start) 
                                        + stage_2_tag_mod 
                                        + this.redhot_post.slice(start, end)
                                        + end_label
                                        + this.redhot_post.slice(end);
                    for (let j = i + 1; j < stage_2.length; j++) {
                        let j_start = stage_2[j].startOffset;
                        let j_end = stage_2[j].endOffset;
                        const get_update_func = (val, start, end, startLen, endLen) => {
                            if (val >= start && val <= end) return val + startLen;
                            else if (val >= start) return val + startLen + endLen;
                            else return val;
                        }
                        stage_2[j].startOffset = get_update_func(j_start, start, end, stage_2_tag_mod.length, end_label.length);
                        stage_2[j].endOffset = get_update_func(j_end, start, end, stage_2_tag_mod.length, end_label.length)
                    }
                }
                const filterKeys = (suff) => {
                    var filtered = [];
                    var keys = Object.keys(this.parsed_file[this.findex]).filter((key) => key.endsWith(suff)).sort((a, b) => {parseInt(a.slice(1)) - parseInt(b.slice(1))});
                    console.log(keys);
                    for (var key of keys) {
                        filtered.push({label: key.replace(suff, ""), text: this.parsed_file[this.findex][key]});
                    }
                    return filtered;
                }           
                const filterKeys_s = (pre) => {
                    var filtered = [];
                    console.log(Object.keys(this.parsed_file[this.findex]).filter((key) => key.startsWith(pre) && key.length < 4));
                    var keys = Object.keys(this.parsed_file[this.findex]).filter((key) => key.startsWith(pre) && key.length < 4).sort((a, b) => {parseInt(a.slice(1)) - parseInt(b.slice(1))});
                    console.log(keys);
                    for (var key of keys) {
                        filtered.push(this.parsed_file[this.findex][key]);
                    }
                    return filtered;
                } 
                let docs = filterKeys('_doc');
                let titles = filterKeys_s('t');
                let doc_claims = filterKeys_s('p');
                let picor_labels = this.parsed_file[this.findex].TS_PICOR;
                console.log(titles);
                console.log(doc_claims);
                let annos = filterKeys('_anno')
                this.tabs = [];
                let relvance_dict = {
                    1: "Relevant",
                    2: "Somewhat Relevant",
                    3: "Irrelevant"
                }
                let r_class_dict = {
                    1: "btn-outline-success",
                    2: "btn-outline-warning",
                    3: "btn-outline-danger"
                }
                for (let i = 0; i < docs.length; i++) {
                    console.log("wft");
                    this.tabs.push({
                        label: docs[i]["label"],
                        title: titles[i],
                        doc: docs[i].text,
                        doc_claim: doc_claims[i],
                        picor_label:picor_labels[i],
                        isActive: false,
                        annot: [{
                            label: "Relevance",
                            anno: relvance_dict[annos[i].text],
                            aclass: r_class_dict[annos[i].text], 
                        }]
                    });
                }
                this.setActive(this.tabs[0]);
            },
            setActive(tab) {
                for (let i = 0; i < this.tabs.length; i++) {
                    this.tabs[i].isActive = false;
                }
                tab.isActive = true;
            },
            highlightPICOR(doc, span, label, classname) {
                let h_tag = '<span class="high ' + classname + '"><div class="hovbox">'+ label + '</div>replace</span>';
                h_tag = h_tag.replace("replace", span);
                return doc.replace(span, h_tag);
            },
        },
        computed: {
            printPost() {
                return this.redhot_post;
            },
            printAbs() {
                for (let i = 0; i < this.tabs.length; i++) {
                    if (this.tabs[i].isActive) {
                        // let h_tag = '<span class="high highGreen"><div class="hovbox">Relevant Span</div>replace</span>';
                        // if (!this.tabs[i].doc.includes(this.tabs[i].doc_claim)){
                        //     //this.tabs[i].doc_claim = this.tabs[i].doc_claim.replaceAll("=", " = ");
                        //     console.log("ERROR ALERT");
                        // }
                        // h_tag = h_tag.replace("replace", this.tabs[i].doc_claim);
                        // console.log(this.tabs[i].doc_claim);
                        // return this.tabs[i].doc.replace(this.tabs[i].doc_claim, h_tag);
                        let all_h = []
                        all_h.push({span:this.tabs[i].doc_claim, label:"Relevant Span", cname: "highGreen"});
                        //all_h.push({span:this.tabs[i].picor_label.Punchline, label:"Punchline", cname: "highBlue"});
                        if(Object.keys(this.tabs[i]).includes("picor_label")) {
                            let l_labels = ['Population', 'Intervention', 'Outcome'];
                            for (let lab of l_labels) {
                                let lab_arr = this.tabs[i].picor_label[lab];
                                for (let sp of lab_arr) {
                                    all_h.push({span:sp, label:lab, cname:"highBlue"});
                                }
                            }
                        }
                        all_h.sort((a, b) => {
                            return b.span.length - a.span.length;
                        });
                        var doc_copy = (" " + this.tabs[i].doc).slice(1);
                        for (let h of all_h) {
                            doc_copy = this.highlightPICOR(doc_copy, h.span, h.label, h.cname);
                        }
                        return doc_copy;
                    }
                }
            }
        }
    }
</script>

<style>

    .highYellow {
        background: rgb(243, 243, 162);
    }
    .highBlue {
        background: rgb(173, 173, 250);
    }

    .highGreen {
        background: rgb(175, 247, 175);
    }

    .highdYellow {
        background: rgb(209, 249, 151);
    }

    .hovbox {
        display: none;
    }

    .high:hover > .hovbox {
        display: inline-block;
        position: absolute;
        margin-top: -26px;
        background-color: inherit;
        padding: 5px 5px 0px 5px;
        border-radius: 5px 5px 0px 0px;
        filter: brightness(90%) saturate(200%);
    }

</style>