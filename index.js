const core = require('@actions/core');
const exec = require("@actions/exec");

async function run() {
    const docker_registry_server = 'docker.pkg.github.com';
    const token = core.getInput("gh_token", { required: true });
    const custom_tags = core.getInput("tags").toLowerCase();
    const tag_with_ref = core.getInput("tag_with_ref") === 'true' ? process.env.GITHUB_REF : false;
    const tag_with_sha = core.getInput("tag_with_sha") === 'true' ? process.env.GITHUB_SHA : false;
    const path = core.getInput("path");
    const dockerfile = core.getInput("dockerfile");
    const target = core.getInput("target");
    const build_args = core.getInput("build_args");
    const labels = core.getInput("labels");
    const push = core.getInput("push") === 'true' ? true : false;
    const image_name = core.getInput("image_name").toLowerCase();
    const username = process.env.GITHUB_ACTOR;
    const github_repo = process.env.GITHUB_REPOSITORY.toLowerCase();

    const image_full_name = `${docker_registry_server}/${github_repo}/${image_name}`;
    const dockerfile_location = `${path}/${dockerfile}`;
    let all_tags = [];
    // const image_names = [];

    if (custom_tags && custom_tags.length > 0)
        all_tags = all_tags.concat(custom_tags.split(','));

    if (tag_with_ref) {
        all_tags.push(tag_with_ref.replace(/refs\/tags\/|refs\/heads\//g, ''))
    }
    if (tag_with_sha) {
        all_tags.push(tag_with_sha)
    }



    try {
        const login_command = `docker login ${docker_registry_server} -u ${username} -p ${token}`;

        exec.exec(login_command);

        let build_tags_params = '';
        if (all_tags.length == 0) {
            all_tags.push('latest');
        }

        all_tags.forEach(tag => {
            build_tags_params += ` -t ${image_full_name}:${tag}`
        });
        
        let build_args_params = '';
        
        let all_args=[];
        if(build_args.length!=0){
            all_args = build_args.split(','); 
        }
        
        all_args.forEach(arg=>{
           build_args_params +=  ` --build-arg ${arg}`;
        });
        
        let build_target_params = '';
        if (target && target.length > 0) {
            build_target_params = `--target ${target}`
        }

        let build_label_params = '';
        if (labels && labels.length > 0) {
            build_label_params = `--label ${labels}`
        }

        const build_command = `docker build --file ${dockerfile_location} ${build_tags_params} ${build_target_params} ${build_label_params} ${build_args_params} ${path} `;

        await exec.exec(build_command);

        // await exec.exec('docker images');


        if (push) {
            await exec.exec(`docker push ${image_full_name}`);
        }

    } catch (err) {
        core.setFailed();
    }

}


run();
